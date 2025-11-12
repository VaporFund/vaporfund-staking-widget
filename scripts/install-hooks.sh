#!/bin/bash

# VaporFund Staking Widget - Git Hooks Installation Script
# Installs pre-commit and pre-push hooks

set -e

WIDGET_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HOOKS_DIR="$WIDGET_DIR/.git/hooks"

echo "🔧 Installing Git hooks for VaporFund Staking Widget..."
echo "📍 Widget directory: $WIDGET_DIR"
echo "📍 Hooks directory: $HOOKS_DIR"

# Verify we're in the widget directory
if [ ! -f "$WIDGET_DIR/package.json" ]; then
  echo "❌ Error: Not in widget directory"
  exit 1
fi

# Verify hooks directory exists
if [ ! -d "$HOOKS_DIR" ]; then
  echo "❌ Error: Git hooks directory not found"
  echo "💡 Make sure you're in a git repository"
  exit 1
fi

# Create pre-commit hook
echo ""
echo "📝 Installing pre-commit hook..."
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash

# VaporFund Staking Widget - Pre-commit Hook
# Runs linting, type checking, and formatting validation before commit

set -e

echo "🔍 Running pre-commit checks..."

# Change to widget directory
cd "$(git rev-parse --show-toplevel)/src/widget" || exit 1

# Check if staged files include TypeScript/React files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$' || true)

if [ -z "$STAGED_FILES" ]; then
  echo "✅ No TypeScript/React files to check"
  exit 0
fi

echo "📝 Found staged files:"
echo "$STAGED_FILES"

# 1. Run ESLint on staged files
echo ""
echo "🔧 Running ESLint..."
if ! yarn lint; then
  echo "❌ ESLint failed. Please fix linting errors before committing."
  echo "💡 Run 'yarn lint:fix' to auto-fix some issues"
  exit 1
fi

# 2. Run TypeScript type checking
echo ""
echo "🔍 Running TypeScript type checking..."
if ! yarn typecheck; then
  echo "❌ TypeScript type checking failed. Please fix type errors before committing."
  exit 1
fi

# 3. Check formatting with Prettier
echo ""
echo "🎨 Checking code formatting..."
if ! yarn prettier --check "src/**/*.{ts,tsx,css}"; then
  echo "❌ Code formatting issues detected."
  echo "💡 Run 'yarn format' to auto-format files"
  exit 1
fi

# 4. Run unit tests (fast tests only, no coverage)
echo ""
echo "🧪 Running unit tests..."
if ! yarn test --run --reporter=dot; then
  echo "❌ Unit tests failed. Please fix failing tests before committing."
  exit 1
fi

echo ""
echo "✅ All pre-commit checks passed!"
echo ""

exit 0
EOF

chmod +x "$HOOKS_DIR/pre-commit"
echo "✅ Pre-commit hook installed"

# Create pre-push hook
echo ""
echo "📝 Installing pre-push hook..."
cat > "$HOOKS_DIR/pre-push" << 'EOF'
#!/bin/bash

# VaporFund Staking Widget - Pre-push Hook
# Runs comprehensive tests and builds before pushing to remote

set -e

echo "🚀 Running pre-push checks..."

# Change to widget directory
cd "$(git rev-parse --show-toplevel)/src/widget" || exit 1

# Get the current branch name
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"

# 1. Run all linting and type checks (same as pre-commit)
echo ""
echo "🔧 Running ESLint..."
if ! yarn lint; then
  echo "❌ ESLint failed. Please fix linting errors before pushing."
  exit 1
fi

echo ""
echo "🔍 Running TypeScript type checking..."
if ! yarn typecheck; then
  echo "❌ TypeScript type checking failed. Please fix type errors before pushing."
  exit 1
fi

# 2. Run full test suite with coverage
echo ""
echo "🧪 Running full test suite..."
if ! yarn test --run; then
  echo "❌ Tests failed. Please fix failing tests before pushing."
  exit 1
fi

# 3. Check test coverage (warn if below threshold, don't block)
echo ""
echo "📊 Generating test coverage report..."
if yarn coverage --reporter=text-summary 2>&1 | grep -q "All files"; then
  COVERAGE=$(yarn coverage --reporter=text-summary 2>&1 | grep "All files" | awk '{print $10}' | sed 's/%//')
  if [ -n "$COVERAGE" ] && [ "$COVERAGE" -lt 80 ]; then
    echo "⚠️  Warning: Test coverage is below 80% (${COVERAGE}%)"
    echo "💡 Consider adding more tests before pushing"
  else
    echo "✅ Test coverage: ${COVERAGE}%"
  fi
fi

# 4. Verify builds succeed
echo ""
echo "🏗️  Building library..."
if ! yarn build; then
  echo "❌ Library build failed. Please fix build errors before pushing."
  exit 1
fi

echo ""
echo "🏗️  Building CDN bundle..."
if ! yarn build:cdn; then
  echo "❌ CDN build failed. Please fix build errors before pushing."
  exit 1
fi

# 5. Check for sensitive data in commits
echo ""
echo "🔐 Checking for sensitive data..."
SENSITIVE_PATTERNS=(
  "vf_live_"
  "vf_test_"
  "PRIVATE_KEY"
  "API_SECRET"
  "PASSWORD"
  "sk_live_"
  "sk_test_"
)

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
  if git log origin/${CURRENT_BRANCH}..HEAD --all -p | grep -i "$pattern" > /dev/null 2>&1; then
    echo "❌ Found potentially sensitive data: $pattern"
    echo "⚠️  Please review your commits and remove any secrets"
    exit 1
  fi
done

echo "✅ No sensitive data detected"

# 6. Verify conventional commit format for main branches
if [[ "$CURRENT_BRANCH" == "main" ]] || [[ "$CURRENT_BRANCH" == "develop" ]]; then
  echo ""
  echo "📝 Verifying conventional commit format..."

  COMMITS=$(git log origin/${CURRENT_BRANCH}..HEAD --pretty=format:"%s")

  while IFS= read -r commit; do
    if ! echo "$commit" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+"; then
      echo "❌ Invalid commit message format: $commit"
      echo "💡 Use conventional commits: <type>(scope): <message>"
      echo "   Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert"
      exit 1
    fi
  done <<< "$COMMITS"

  echo "✅ All commit messages follow conventional format"
fi

echo ""
echo "✅ All pre-push checks passed!"
echo "🎉 Safe to push to remote"
echo ""

exit 0
EOF

chmod +x "$HOOKS_DIR/pre-push"
echo "✅ Pre-push hook installed"

echo ""
echo "✅ Git hooks installed successfully!"
echo ""
echo "📋 Installed hooks:"
echo "   - pre-commit: Runs linting, type checking, formatting, and unit tests"
echo "   - pre-push: Runs full test suite, builds, and security checks"
echo ""
echo "💡 To bypass hooks temporarily (not recommended):"
echo "   git commit --no-verify"
echo "   git push --no-verify"
echo ""

exit 0
