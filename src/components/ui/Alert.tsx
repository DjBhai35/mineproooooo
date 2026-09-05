import React from 'react';

export type AlertType = 'success' | 'warning' | 'danger' | 'info' | 'processing';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return {
          bsClass: 'alert-success border-success-subtle bg-success-subtle text-success-emphasis',
          icon: 'bi-check-circle-fill text-success',
        };
      case 'warning':
        return {
          bsClass: 'alert-warning border-warning-subtle bg-warning-subtle text-warning-emphasis',
          icon: 'bi-exclamation-triangle-fill text-warning',
        };
      case 'danger':
        return {
          bsClass: 'alert-danger border-danger-subtle bg-danger-subtle text-danger-emphasis',
          icon: 'bi-x-circle-fill text-danger',
        };
      case 'processing':
        return {
          bsClass: 'alert-info border-info-subtle bg-info-subtle text-info-emphasis',
          icon: 'bi-arrow-repeat bi-spin text-info',
        };
      case 'info':
      default:
        return {
          bsClass: 'alert-light border bg-white text-dark',
          icon: 'bi-info-circle-fill text-primary',
        };
    }
  };

  const { bsClass, icon } = getAlertStyle();

  return (
    <div
      className={`alert ${bsClass} rounded-3 p-3 d-flex align-items-start gap-3 ${className}`}
      role="alert"
    >
      <i className={`bi ${icon} fs-5 flex-shrink-0 mt-1`} />
      <div className="flex-grow-1">
        {title && <div className="fw-bold mb-1">{title}</div>}
        <div className="small mb-0">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          className="btn-close ms-auto"
          aria-label="Close"
          onClick={onDismiss}
        />
      )}
    </div>
  );
};
