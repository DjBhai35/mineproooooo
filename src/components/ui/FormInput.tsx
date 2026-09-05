import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: string;
  rightAddon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  helperText,
  error,
  icon,
  rightAddon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={inputId} className="form-label fw-semibold text-dark small mb-1">
          {label}
        </label>
      )}
      <div className="input-group">
        {icon && (
          <span className="input-group-text bg-light text-muted border-end-0">
            <i className={`bi ${icon}`} />
          </span>
        )}
        <input
          id={inputId}
          className={`form-control ${icon ? 'border-start-0' : ''} ${error ? 'is-invalid' : ''} ${className}`}
          {...props}
        />
        {rightAddon && <span className="input-group-text bg-white">{rightAddon}</span>}
      </div>
      {error && <div className="invalid-feedback d-block small mt-1">{error}</div>}
      {!error && helperText && <small className="text-muted d-block mt-1">{helperText}</small>}
    </div>
  );
};
