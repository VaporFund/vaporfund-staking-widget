# Contributing to VaporFund Staking Widget

Thank you for your interest in contributing! This guide will help you get started.

## Prerequisites

- **Node.js** >= 18.0.0
- **Yarn** >= 1.22.0 (required)

**Important:** This project uses Yarn as the package manager. Using npm or pnpm will fail the preinstall check.

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/vaporfund-staking-platform.git
cd vaporfund-staking-platform/src/widget
```

### 2. Install Dependencies

```bash
# Install Yarn if you haven't already
npm install -g yarn

# Install project dependencies
yarn install
```

### 3. Create a Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## Development Workflow

### Running the Dev Server

```bash
yarn dev
```

Visit http://localhost:5173 to see your changes.

### Running Tests

```bash
# Unit tests
yarn test

# Watch mode
yarn test --watch

# Coverage
yarn coverage

# E2E tests
yarn test:e2e
```

### Code Quality

Before committing, ensure your code passes all checks:

```bash
# Type checking
yarn typecheck

# Linting
yarn lint

# Formatting
yarn format

# Run all checks
yarn typecheck && yarn lint && yarn test
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(widget): add new wallet provider
fix(widget): resolve connection timeout
docs(widget): update integration guide
style(widget): format code
refactor(widget): optimize hook performance
test(widget): add validation tests
chore(widget): update dependencies
```

### Examples

```bash
git commit -m "feat(widget): add support for WalletConnect v2"
git commit -m "fix(widget): resolve theme switching bug"
git commit -m "docs(widget): add Next.js integration example"
```

## Pull Request Process

### 1. Update Your Fork

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Run All Checks

```bash
yarn typecheck && yarn lint && yarn test
```

### 3. Push Your Changes

```bash
git push origin feat/your-feature-name
```

### 4. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Fill in the PR template
- Request review from maintainers

### PR Requirements

- ✅ All tests passing
- ✅ Code coverage maintained (>80%)
- ✅ Type checking passes
- ✅ Linting passes
- ✅ Includes tests for new features
- ✅ Documentation updated
- ✅ Follows commit convention
- ✅ No merge conflicts

## Code Style

### TypeScript

- Use TypeScript strict mode
- Define explicit types for function parameters and returns
- Avoid `any` types (use `unknown` if needed)
- Use interfaces for object types

### React

- Use functional components
- Use custom hooks for reusable logic
- Keep components small and focused
- Use proper prop types

### CSS

- Use Tailwind utility classes
- Follow BEM naming for custom classes
- Use CSS variables for theming

## Testing Guidelines

### Unit Tests

- Test all utility functions
- Test custom hooks in isolation
- Mock external dependencies

### Component Tests

- Test user interactions
- Test error states
- Test accessibility

### E2E Tests

- Test complete user flows
- Test cross-browser compatibility
- Test responsive design

## Project Structure

```
src/widget/
├── src/
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities and services
│   ├── types/            # TypeScript types
│   ├── constants/        # Constants
│   └── styles/           # Global styles
├── examples/             # Integration examples
├── tests/                # Test files
└── docs/                 # Documentation
```

## Common Issues

### Yarn Not Found

```bash
npm install -g yarn
```

### Preinstall Error with npm

The project enforces Yarn usage. Use `yarn install` instead of `npm install`.

### Type Errors

```bash
# Regenerate types
yarn build

# Check specific file
yarn typecheck src/path/to/file.ts
```

### Test Failures

```bash
# Run tests in watch mode
yarn test --watch

# Debug specific test
yarn test path/to/test.test.ts
```

## Getting Help

- **Discord:** [discord.com/invite/qWXfwMz4pP](https://discord.com/invite/qWXfwMz4pP)
- **Twitter:** [@vaporfund](https://twitter.com/vaporfund)
- **Issues:** [GitHub Issues](https://github.com/vaporfund/vaporfund-staking-platform/issues)

## Code of Conduct

Be respectful and inclusive. We're all here to build great software together.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to VaporFund! 🚀
