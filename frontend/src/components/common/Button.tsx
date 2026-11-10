import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-[6px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2B2118] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'h-[30px] px-3 text-[13px]',
    md: 'h-[36px] px-4 text-[14px]',
    lg: 'h-[40px] px-5 text-[15px]',
  };

  const variantStyles = {
    primary:
      'bg-[#D14509] hover:bg-[#b83c07] text-white font-semibold shadow-sm hover:-translate-y-[1px]',
    secondary:
      'bg-white hover:bg-[#FFF7F1] text-ink border border-[#D6D0C7] hover:border-[#2B2118]',
    outline:
      'bg-transparent hover:bg-[#FFF7F1] text-ink border border-divider hover:border-ink',
    ghost: 'bg-transparent hover:bg-[#FFF7F1] text-muted hover:text-ink',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center space-x-1.5">
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Working…</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

