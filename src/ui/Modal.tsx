import React, { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import useOnClickOutside from '@/hooks/useOnOutsideClick';
import './Modal.css';

interface IModalProps {
  onClose: () => void;
  children: ReactNode;
  title: string;
  closeOnClickOutside?: boolean;
}

function PortalImpl({
  onClose,
  children,
  title,
  closeOnClickOutside,
}: IModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current !== null) {
      modalRef.current.focus();
    }
  }, []);

  useOnClickOutside(modalRef, onClose);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [closeOnClickOutside, onClose]);

  return (
    <div className='Modal__overlay' role='dialog'>
      <div className='Modal__modal' tabIndex={-1} ref={modalRef}>
        <h2 className='Modal__title'>{title}</h2>
        <button
          className='Modal__closeButton'
          aria-label='Close modal'
          type='button'
          onClick={onClose}
        >
          X
        </button>
        <div className='Modal__content'>{children}</div>
      </div>
    </div>
  );
}

export default function Modal(props: IModalProps) {
  return createPortal(<PortalImpl {...props}></PortalImpl>, document.body);
}
