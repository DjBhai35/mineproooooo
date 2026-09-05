import React from 'react';

export type ButtonVariant = 
  | 'black' 
  | 'orange' 
  | 'green' 
  | 'outline-black' 
  | 'outline-orange' 
  | 'outline-green'
  | 'secondary'
  | 'light';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: string; // Bootstrap icon class, e.g. 'bi-play-fill'
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'black',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const variantClasses: Record<ButtonVariant, string> = {
    black: 'btn-minepro-black',
    orange: 'btn-minepro-orange',
    green: 'btn-minepro-green',
    'outline-black': 'btn-minepro-outline-black',
    'outline-orange': 'btn-minepro-outline-orange',
    'outline-green': 'btn-minepro-outline-green',
    secondary: 'btn btn-secondary',
    light: 'btn btn-light bg-white border',
  };

  const sizeClasses = {
    sm: 'btn-sm py-1 px-3 fs-6',
    md: 'py-2 px-4',
    lg: 'btn-lg py-3 px-5 fs-5',
  };

  return (
    <button
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-100' : ''} d-inline-flex align-items-center justify-content-center gap-2 ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span
          className="spinner-border spinner-border-sm text-light me-1"
          role="status"
          aria-hidden="true"
        />
      )}
      {!isLoading && icon && iconPosition === 'left' && <i className={`bi ${icon}`} />}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && <i className={`bi ${icon}`} />}
    </button>
  );
};
