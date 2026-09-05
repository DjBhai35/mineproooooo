import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There are no active records or transactions to display right now.',
  icon = 'bi-inbox',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-5 px-4 ${className}`}>
      <div 
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
        style={{ width: 64, height: 64, backgroundColor: '#f0fdf4', color: '#16a34a' }}
      >
        <i className={`bi ${icon} fs-2`} />
      </div>
      <h6 className="fw-bold text-dark mb-1">{title}</h6>
      <p className="text-muted small mx-auto mb-3" style={{ maxWidth: 360 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="orange" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load authoritative ledger data. Please verify network status or try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`text-center py-5 px-4 ${className}`}>
      <div 
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
        style={{ width: 64, height: 64, backgroundColor: '#fef2f2', color: '#dc2626' }}
      >
        <i className="bi bi-exclamation-octagon fs-2" />
      </div>
      <h6 className="fw-bold text-danger mb-1">{title}</h6>
      <p className="text-muted small mx-auto mb-3" style={{ maxWidth: 360 }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="outline-black" size="sm" icon="bi-arrow-clockwise" onClick={onRetry}>
          Retry Request
        </Button>
      )}
    </div>
  );
};

export const Skeleton: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}> = ({ width = '100%', height = '1rem', className = '', rounded = true }) => {
  return (
    <div
      className={`placeholder-glow ${className}`}
      style={{ display: 'inline-block', width, verticalAlign: 'middle' }}
    >
      <span
        className={`placeholder col-12 bg-secondary-subtle ${rounded ? 'rounded' : ''}`}
        style={{ height, display: 'block' }}
      />
    </div>
  );
};
