import React from 'react';

export type BadgeVariant = 
  | 'green' 
  | 'orange' 
  | 'black' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info' 
  | 'secondary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  pill?: boolean;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  pill = true,
  dot = false,
  className = '',
}) => {
  const getBadgeClass = () => {
    switch (variant) {
      case 'green':
        return 'badge-minepro-green';
      case 'orange':
        return 'badge-minepro-orange';
      case 'black':
        return 'badge-minepro-black';
      case 'success':
        return 'badge bg-success-subtle text-success border border-success-subtle';
      case 'warning':
        return 'badge bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      case 'danger':
        return 'badge bg-danger-subtle text-danger border border-danger-subtle';
      case 'info':
        return 'badge bg-info-subtle text-info-emphasis border border-info-subtle';
      default:
        return 'badge bg-secondary-subtle text-secondary';
    }
  };

  return (
    <span className={`d-inline-flex align-items-center gap-1 ${getBadgeClass()} ${pill ? 'rounded-pill' : 'rounded'} ${className}`}>
      {dot && (
        <span 
          className="rounded-circle d-inline-block" 
          style={{ 
            width: 6, 
            height: 6, 
            backgroundColor: variant === 'orange' ? '#f97316' : '#16a34a' 
          }} 
        />
      )}
      {children}
    </span>
  );
};
