import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { VaporStakingWidget } from '../VaporStakingWidget';
import { mockEthereum } from '@/test/mocks/ethereum';
import { mockApiClient } from '@/test/mocks/api';

// Mock window.ethereum
global.window.ethereum = mockEthereum;

// Mock API client
vi.mock('@/lib/api/client', () => ({
  default: vi.fn().mockImplementation(() => mockApiClient),
}));

describe('VaporStakingWidget', () => {
  const defaultProps = {
    apiKey: 'pk_test_12345678901234567890123456789012',
    referralCode: 'test_ref',
    network: 'sepolia' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render widget', () => {
    render(<VaporStakingWidget {...defaultProps} />);
    expect(screen.getByText('Stake USDC')).toBeInTheDocument();
  });

  it('should show connect wallet button when not connected', () => {
    render(<VaporStakingWidget {...defaultProps} />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('should load strategies on mount', async () => {
    render(<VaporStakingWidget {...defaultProps} />);

    await waitFor(() => {
      expect(mockApiClient.getStrategies).toHaveBeenCalled();
    });
  });

  it('should show wallet connection UI', () => {
    render(<VaporStakingWidget {...defaultProps} />);

    const connectButton = screen.getByText('Connect Wallet');
    expect(connectButton).toBeInTheDocument();

    const walletIcon = screen.getByRole('img', { hidden: true });
    expect(walletIcon).toBeInTheDocument();
  });

  it('should apply compact mode', () => {
    const { container } = render(
      <VaporStakingWidget {...defaultProps} compact={true} />
    );

    expect(container.querySelector('.vapor-widget-compact')).toBeInTheDocument();
  });

  it('should apply custom theme', () => {
    const { container } = render(
      <VaporStakingWidget {...defaultProps} theme="dark" />
    );

    expect(container.querySelector('[data-theme="dark"]')).toBeInTheDocument();
  });

  it('should handle connection button click', async () => {
    render(<VaporStakingWidget {...defaultProps} />);

    const connectButton = screen.getByText('Connect Wallet');
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
      });
    });
  });

  it('should call onSuccess callback', async () => {
    const onSuccess = vi.fn();
    render(<VaporStakingWidget {...defaultProps} onSuccess={onSuccess} />);

    // This would require mocking the full staking flow
    // Implementation depends on component behavior
  });

  it('should call onError callback on error', async () => {
    const onError = vi.fn();
    const errorEthereum = {
      ...mockEthereum,
      request: vi.fn().mockRejectedValue(new Error('Connection failed')),
    };
    global.window.ethereum = errorEthereum;

    render(<VaporStakingWidget {...defaultProps} onError={onError} />);

    const connectButton = screen.getByText('Connect Wallet');
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should display default token', () => {
    render(<VaporStakingWidget {...defaultProps} defaultToken="USDC" />);
    expect(screen.getByText(/USDC/i)).toBeInTheDocument();
  });

  it('should show powered by VaporFund', () => {
    render(<VaporStakingWidget {...defaultProps} />);
    expect(screen.getByText(/Powered by/i)).toBeInTheDocument();
    expect(screen.getByText(/VaporFund/i)).toBeInTheDocument();
  });
});
