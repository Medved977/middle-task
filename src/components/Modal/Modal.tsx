import "./Modal.css";
import React from "react";

interface ModalProps {
  isVisible: Boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isVisible, onClose, children }: ModalProps) => {
  return (
    <React.Fragment>
      {isVisible && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={onClose} className="close-btn">
              X
            </button>
            {children}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Modal;
