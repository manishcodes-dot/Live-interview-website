import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'live' | 'success' | 'warning' | 'neutral' | 'easy' | 'medium' | 'hard';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'live':
        return 'bg-[#FFF3EB] text-[#D14509] border border-[#D14509]/30';
      case 'success':
        return 'bg-[#F2F7F2] text-[#245C2B] border border-[#245C2B]/20';
      case 'warning':
        return 'bg-[#FFF8E6] text-[#785412] border border-[#785412]/20';
      case 'easy':
        return 'bg-white text-[#2B2118] border border-divider';
      case 'medium':
        return 'bg-[#FFF3EB] text-[#D14509] border border-[#D14509]/20 font-medium';
      case 'hard':
        return 'bg-white text-ink border border-ink/40 font-semibold';
      case 'neutral':
      default:
        return 'bg-white text-muted border border-divider';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[12px] font-mono leading-none ${getStyles()} ${className}`}
    >
      {children}
    </span>
  );
};

