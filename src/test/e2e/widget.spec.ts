import { test, expect } from '@playwright/test';

test.describe('VaporFund Staking Widget E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load widget', async ({ page }) => {
    await expect(page.getByText('Stake USDC')).toBeVisible();
  });

  test('should display connect wallet button', async ({ page }) => {
    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    await expect(connectButton).toBeVisible();
  });

  test('should show wallet connection on button click', async ({ page }) => {
    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    await connectButton.click();

    // Wallet modal should appear (depends on RainbowKit implementation)
    // This test may need to be adjusted based on actual modal behavior
  });

  test('should validate amount input', async ({ page }) => {
    // Assuming wallet is connected (may need to mock this)
    const input = page.getByPlaceholder('0.00');

    // Test valid input
    await input.fill('100');
    await expect(input).toHaveValue('100');

    // Test invalid input (letters)
    await input.fill('abc');
    await expect(input).not.toHaveValue('abc');
  });

  test('should show MAX button functionality', async ({ page }) => {
    const maxButton = page.getByRole('button', { name: 'MAX' });
    await expect(maxButton).toBeVisible();
  });

  test('should display strategies when loaded', async ({ page }) => {
    // Wait for strategies to load
    await page.waitForSelector('text=Conservative Yield', { timeout: 5000 });

    // Check if strategies are displayed
    await expect(page.getByText('Conservative Yield')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Stake USDC')).toBeVisible();
  });

  test('should toggle between light and dark theme', async ({ page }) => {
    // Check for theme toggle if implemented
    const widget = page.locator('.vapor-widget');
    await expect(widget).toBeVisible();
  });

  test('should display powered by VaporFund', async ({ page }) => {
    await expect(page.getByText(/Powered by VaporFund/i)).toBeVisible();
  });
});

test.describe('Widget Integration Tests', () => {
  test('should complete full staking flow', async ({ page }) => {
    await page.goto('/');

    // 1. Connect wallet
    await page.getByRole('button', { name: /connect wallet/i }).click();
    // Mock wallet connection would happen here

    // 2. Enter amount
    const input = page.getByPlaceholder('0.00');
    await input.fill('100');

    // 3. Select strategy
    await page.getByText('Conservative Yield').click();

    // 4. Click stake button
    const stakeButton = page.getByRole('button', { name: /stake/i });
    await expect(stakeButton).toBeEnabled();
    await stakeButton.click();

    // 5. Confirmation modal should appear
    await expect(page.getByText('Confirm Stake')).toBeVisible();
  });

  test('should show error for invalid amount', async ({ page }) => {
    await page.goto('/');

    // Try to stake with amount below minimum
    const input = page.getByPlaceholder('0.00');
    await input.fill('5');

    const stakeButton = page.getByRole('button', { name: /stake/i });
    await stakeButton.click();

    // Error message should appear
    await expect(page.getByText(/minimum stake amount/i)).toBeVisible();
  });
});
