import React, { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useOnClickOutside } from '@/hooks/useOnOutsideClick';
import './Modal.css';
import { RxCross2 } from 'react-icons/rx';

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
      <div
        className='Modal__modal relative max-h-full w-full max-w-lg rounded-lg bg-white p-3.5'
        tabIndex={-1}
        ref={modalRef}
      >
        <h2 className='text-base font-medium'>{title}</h2>
        <button
          className='absolute right-4 top-4'
          aria-label='Close modal'
          type='button'
          onClick={onClose}
        >
          <RxCross2 />
        </button>
        <div className='p-4'>{children}</div>
      </div>
    </div>
  );
}

export function Modal(props: IModalProps) {
  return createPortal(<PortalImpl {...props}></PortalImpl>, document.body);
}
