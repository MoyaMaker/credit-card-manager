import { HTMLAttributes, ReactNode, useEffect, useRef } from "react";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  dialogClassName?: string;
  onClose?: () => void;
  children?: ReactNode;
}

export default function Modal({
  children,
  dialogClassName,
  isOpen = true,
  onClose,
  ...rest
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      className={`fixed top-0 right-0 bottom-0 left-0 bg-black/30 items-center justify-center outline-none ${
        isOpen ? "flex" : "hidden"
      }`}
      onClick={onClose}
      onKeyDown={(event) => {
        if (onClose && event.key === "Escape") {
          onClose();
        }
      }}
      {...rest}
    >
      <div
        className={`w-fit bg-white rounded-lg p-5 mx-auto shadow-lg ${dialogClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
