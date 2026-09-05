import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'green' | 'dark' | 'outline-orange' | 'outline-green';
  footer?: React.ReactNode;
  headerBorder?: boolean;
  className?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  variant = 'default',
  footer,
  headerBorder = true,
  className = '',
  bodyClassName = 'p-4',
}) => {
  const variantClasses = {
    default: 'card-minepro',
    elevated: 'card-minepro-elevated',
    green: 'card-minepro-green',
    dark: 'bg-dark text-white border-0 rounded-4',
    'outline-orange': 'card-minepro border-warning-subtle',
    'outline-green': 'card-minepro border-success-subtle',
  };

  return (
    <div className={`card ${variantClasses[variant]} ${className}`}>
      {(title || action) && (
        <div className={`card-header bg-transparent d-flex align-items-center justify-content-between px-4 py-3 ${headerBorder ? 'border-bottom' : 'border-0'}`}>
          <div>
            {typeof title === 'string' ? <h5 className="mb-0 fw-bold">{title}</h5> : title}
            {subtitle && <small className="text-muted d-block mt-1">{subtitle}</small>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`card-body ${bodyClassName}`}>{children}</div>
      {footer && <div className="card-footer bg-transparent px-4 py-3 border-top">{footer}</div>}
    </div>
  );
};
