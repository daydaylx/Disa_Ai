import "./Modal.css";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useIsMobile } from "../../../hooks/useIsMobile";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  ariaLabel?: string;
  width?: string;
  height?: string;
}

export function Modal({
  children,
  isOpen,
  onClose,
  ariaLabel = "Modal dialog",
  width = "95vw",
  height = "90vh",
}: ModalProps) {
  // All hooks must be called at the top level
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();

  // Handle clicks outside modal content
  const handleClickOutside = useCallback(
    (event: React.MouseEvent) => {
      if (backdropRef.current === event.target) {
        onClose();
      }
    },
    [onClose],
  );

  // Handle ESC key
  const handleEscKey = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  // Handle mounting animations
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsMounted(false), 200);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus first element when modal opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Wait for DOM to update
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) as HTMLElement | null;

        if (firstFocusable) {
          firstFocusable.focus();
        } else if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 0);
    }
  }, [isOpen]);

  // Only render on mobile devices - conditional rendering after hooks
  if (!isMobile) {
    return null;
  }

  // Render nothing if not open and not mounted
  if (!isOpen && !isMounted) {
    return null;
  }

  return createPortal(
    <div
      className={`modal-overlay ${isOpen ? "modal-overlay--open" : ""}`}
      ref={backdropRef}
      onClick={handleClickOutside}
      onKeyDown={handleEscKey}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        ref={modalRef}
        className={`modal-content ${isOpen ? "modal-content--open" : ""}`}
        style={{ width, height }}
        tabIndex={-1}
      >
        <div className="modal-header">
          <button className="modal-close-button" onClick={onClose} aria-label="Close modal">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
