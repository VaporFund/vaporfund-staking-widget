import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TokenInput } from '../TokenInput';

describe('TokenInput', () => {
  const defaultProps = {
    value: '',
    balance: '1000',
    tokenSymbol: 'USDC',
    onChange: vi.fn(),
    onMaxClick: vi.fn(),
  };

  it('should render input field', () => {
    render(<TokenInput {...defaultProps} />);
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('should display balance', () => {
    render(<TokenInput {...defaultProps} />);
    expect(screen.getByText(/Balance: 1,000.00 USDC/i)).toBeInTheDocument();
  });

  it('should call onChange with valid number', () => {
    render(<TokenInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('0.00');

    fireEvent.change(input, { target: { value: '100' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith('100');
  });

  it('should call onChange with decimal number', () => {
    render(<TokenInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('0.00');

    fireEvent.change(input, { target: { value: '100.50' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith('100.50');
  });

  it('should not call onChange with invalid input', () => {
    render(<TokenInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('0.00');

    defaultProps.onChange.mockClear();
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('should call onMaxClick when MAX button clicked', () => {
    render(<TokenInput {...defaultProps} />);
    const maxButton = screen.getByText('MAX');

    fireEvent.click(maxButton);
    expect(defaultProps.onMaxClick).toHaveBeenCalled();
  });

  it('should display USD equivalent', () => {
    render(<TokenInput {...defaultProps} value="100" />);
    expect(screen.getByText(/≈ \$100.00/i)).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<TokenInput {...defaultProps} error="Insufficient balance" />);
    expect(screen.getByText('Insufficient balance')).toBeInTheDocument();
  });

  it('should apply error styling when error present', () => {
    const { container } = render(
      <TokenInput {...defaultProps} error="Insufficient balance" />
    );
    const input = container.querySelector('input');
    expect(input?.className).toContain('vapor-input-error');
  });

  it('should handle empty value', () => {
    render(<TokenInput {...defaultProps} value="" />);
    const input = screen.getByPlaceholderText('0.00');
    expect(input).toHaveValue('');
  });
});
