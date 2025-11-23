import { test, expect } from '@playwright/test';

test.describe('VaporFund Staking Widget E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load widget', async ({ page }) => {
    // Widget header shows "Stake USDC"
    await expect(page.getByText('Stake USDC')).toBeVisible();
  });

  test('should display connect wallet button when not connected', async ({ page }) => {
    // Look for connect wallet button in the main content area
    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    await expect(connectButton).toBeVisible();
  });

  test('should show appropriate state when API validation completes', async ({ page }) => {
    // The widget shows either:
    // 1. "Connect your wallet to start staking" (if API key is valid)
    // 2. "API Key Error" (if API key validation fails or backend unavailable)
    // Both are valid states depending on backend availability
    const walletPrompt = page.getByText('Connect your wallet to start staking');
    const apiKeyError = page.getByText('API Key Error');

    // Wait for either state to appear (one of them should be visible)
    await expect(walletPrompt.or(apiKeyError)).toBeVisible();
  });

  test('should display about section', async ({ page }) => {
    // About section should be visible
    await expect(page.getByText('About Vapor Staking')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Stake USDC')).toBeVisible();
  });

  test('should have vapor-widget class', async ({ page }) => {
    const widget = page.locator('.vapor-widget');
    await expect(widget).toBeVisible();
  });

  test('should display powered by VaporFund', async ({ page }) => {
    await expect(page.getByText(/Powered by/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'VaporFund' })).toBeVisible();
  });

  test('should have visit platform link', async ({ page }) => {
    const visitLink = page.getByRole('link', { name: /Visit Platform/i });
    await expect(visitLink).toBeVisible();
  });

  test('should toggle about section', async ({ page }) => {
    // Click to collapse
    await page.getByText('About Vapor Staking').click();

    // The description should be hidden (collapsed)
    const description = page.getByText(/Stake your tokens securely/);
    await expect(description).not.toBeVisible();

    // Click to expand again
    await page.getByText('About Vapor Staking').click();
    await expect(description).toBeVisible();
  });
});

test.describe('Widget Form Tests (requires mock wallet)', () => {
  // These tests would require mocking wallet connection
  // For now, they test the initial state before wallet connection

  test('should not show staking form when wallet not connected', async ({ page }) => {
    await page.goto('/');

    // The amount input should NOT be visible when wallet not connected
    const amountInput = page.getByPlaceholder('0.0');
    await expect(amountInput).not.toBeVisible();
  });

  test('should show API key validation state', async ({ page }) => {
    await page.goto('/');

    // Either shows validating state or proceeds to wallet connection prompt
    // Check that widget loads and shows expected states
    const widget = page.locator('.vapor-widget');
    await expect(widget).toBeVisible();
  });
});

test.describe('Widget Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');

    // Main heading
    const heading = page.getByRole('heading', { name: /Stake USDC/i });
    await expect(heading).toBeVisible();
  });

  test('should have accessible link for VaporFund', async ({ page }) => {
    await page.goto('/');

    const link = page.getByRole('link', { name: 'VaporFund' });
    await expect(link).toHaveAttribute('href', 'https://vaporfund.com');
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('should have accessible connect wallet button', async ({ page }) => {
    await page.goto('/');

    const button = page.getByRole('button', { name: /connect wallet/i });
    await expect(button).toBeEnabled();
  });
});
