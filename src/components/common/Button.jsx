import React from 'react';

/**
 * Reusable Button Component
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'whatsapp'} props.variant
 * @param {'sm' | 'md' | 'lg'} props.size
 * @param {boolean} props.fullWidth
 * @param {React.ReactNode} props.leftIcon
 * @param {React.ReactNode} props.rightIcon
 * @param {React.ReactNode} props.children
 * @param {boolean} props.disabled
 * @param {string} props.className
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-sm hover:shadow',
    secondary: 'bg-secondary text-primary hover:bg-emerald-100 focus:ring-primary',
    accent: 'bg-accent text-white hover:bg-amber-600 focus:ring-accent shadow-sm',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary',
    ghost: 'text-mainText hover:bg-black/5 focus:ring-primary/20',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#20ba5a] focus:ring-[#25D366] shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[34px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[42px]',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px] font-semibold',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${widthStyle} ${className}`}
      {...rest}
    >
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
}

export default Button;

