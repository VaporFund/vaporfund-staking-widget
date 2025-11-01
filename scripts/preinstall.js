#!/usr/bin/env node

/**
 * Enforce Yarn package manager
 * This script prevents accidental usage of npm or pnpm
 */

if (process.env.npm_execpath && !process.env.npm_execpath.includes('yarn')) {
  console.error('\x1b[31m%s\x1b[0m', '╔═══════════════════════════════════════════════════════════════╗');
  console.error('\x1b[31m%s\x1b[0m', '║                                                               ║');
  console.error('\x1b[31m%s\x1b[0m', '║  ⚠️  Please use Yarn to install dependencies                  ║');
  console.error('\x1b[31m%s\x1b[0m', '║                                                               ║');
  console.error('\x1b[31m%s\x1b[0m', '║  This project uses Yarn as the package manager.              ║');
  console.error('\x1b[31m%s\x1b[0m', '║                                                               ║');
  console.error('\x1b[31m%s\x1b[0m', '║  To install dependencies, run:                                ║');
  console.error('\x1b[33m%s\x1b[0m', '║    yarn install                                               ║');
  console.error('\x1b[31m%s\x1b[0m', '║                                                               ║');
  console.error('\x1b[31m%s\x1b[0m', '║  If you don\'t have Yarn installed:                            ║');
  console.error('\x1b[33m%s\x1b[0m', '║    npm install -g yarn                                        ║');
  console.error('\x1b[31m%s\x1b[0m', '║                                                               ║');
  console.error('\x1b[31m%s\x1b[0m', '╚═══════════════════════════════════════════════════════════════╝');
  console.error('');
  process.exit(1);
}
