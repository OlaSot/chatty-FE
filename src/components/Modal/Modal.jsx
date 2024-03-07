import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modal-root');

const Modal = ({ children, onClose }) => {
  const el = document.createElement('div');

  useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, [el]);

  return ReactDOM.createPortal(
    <div className='modal-overlay'>
      <div className='modal-content'>
        <button className='close' onClick={onClose}>
          ✖️
        </button>
        {children}
      </div>
    </div>,
    el,
  );
};

export default Modal;
