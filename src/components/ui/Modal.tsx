import React, { useEffect } from 'react';
import { Button, ButtonVariant } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryActionLabel?: string;
  primaryActionVariant?: ButtonVariant;
  onPrimaryAction?: () => void;
  isActionLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  primaryActionLabel,
  primaryActionVariant = 'black',
  onPrimaryAction,
  isActionLoading = false,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = size === 'lg' ? 'modal-lg' : size === 'sm' ? 'modal-sm' : '';

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: 'rgba(11, 24, 18, 0.65)', backdropFilter: 'blur(3px)' }}
    >
      <div className={`modal-dialog modal-dialog-centered ${sizeClass}`} role="document">
        <div className="modal-content card-minepro border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-bottom px-4 py-3 bg-light">
            <h5 className="modal-title fw-bold text-dark fs-6">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body px-4 py-4">{children}</div>
          <div className="modal-footer border-top px-4 py-3 bg-light">
            <Button variant="light" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {primaryActionLabel && onPrimaryAction && (
              <Button
                variant={primaryActionVariant}
                size="sm"
                isLoading={isActionLoading}
                onClick={onPrimaryAction}
              >
                {primaryActionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
