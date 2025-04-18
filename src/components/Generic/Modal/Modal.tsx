import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import Button from "../Button/Button";
import { XMarkIcon } from '@heroicons/react/16/solid';

interface ModalProps {
  children: ReactNode;
  open: boolean; // Whether the modal is open
  onClose: () => void; // Function to close the modal
  className?: string; // Additional classes for modal container
}

const Modal: React.FC<ModalProps> = ({
  children,
  open,
  onClose,
  className = "",
}) => {

  // modal component closes when clicking outside of the modal
  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return ReactDOM.createPortal(
    <div
      className={`fixed bg-[#1E617959] w-full h-full left-0 top-0 ${open ? "block" : "hidden"}`}
        onClick={handleClose}
    >
      <div 
        className={`fixed bg-light-beige max-w-screen w-[1280px] max-h-960 -translate-x-2/4 -translate-y-2/4 flex flex-col items-center rounded-[20px] left-2/4 top-2/4 ${className}`}
      >
        <div className={``}>
          <Button
            variant="light"
            className="absolute top-4 right-4 rounded-full"
            onClick={onClose}
          >
              <XMarkIcon className="text-dark-blue w-5 h-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>, document.body
  );
};

export default Modal;