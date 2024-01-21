import useOnClickOutside from '@/hooks/useOnOutsideClick';
import { normalize } from '@/utils/normalize';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

export type SelectOption = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
};

export interface ISelectProps<Option extends SelectOption = SelectOption> {
  options: Option[];
  value: string | null | Partial<Option>;
  onChange: (option: Option) => void;
  placeholder?: ReactNode;
  disabled?: boolean;
}

const Select = <Option extends SelectOption>({
  onChange,
  options,
  value,
  placeholder = 'Select an option',
}: ISelectProps<Option>) => {
  const optionsRecord = normalize(options, 'value');
  const selectedOption =
    typeof value === 'string' ? optionsRecord[value] ?? null : value ?? null;
  const containerRef = useRef<HTMLDivElement>(null);
  const optionContainerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const calculatePosition = useCallback(() => {
    if (!containerRef.current || !optionContainerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const optionContainer = optionContainerRef.current;

    // Calculate left and top positions
    optionContainer.style.left = `${rect.left}px`;
    optionContainer.style.top = `${rect.bottom}px`;
    optionContainer.style.minWidth = `${rect.width}px`;

    // Calculate height based on the available space below the select container
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;
    const optionsHeight = optionContainer.offsetHeight;

    if (spaceBelow < optionsHeight && spaceAbove > spaceBelow) {
      // If there's not enough space below, position the dropdown above the select container
      optionContainer.style.top = `${rect.top - optionsHeight}px`;
      optionContainer.style.maxHeight = `${spaceAbove}px`;
    } else {
      optionContainer.style.maxHeight = `${spaceBelow}px`;
    }

    const optionRect = optionContainer.getBoundingClientRect();
    const totalX = optionRect.left + optionRect.width;
    if (totalX > window.innerWidth) {
      optionContainer.style.left = `${rect.right - optionRect.width}px`;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const optionsContainer = optionContainerRef.current;
    if (!container || !optionsContainer) return;
    const observer = new ResizeObserver(() => {
      calculatePosition();
    });
    window.addEventListener('resize', calculatePosition);
    observer.observe(container);

    calculatePosition();
    return () => {
      window.removeEventListener('resize', calculatePosition);
      observer.disconnect();
    };
  }, [calculatePosition]);

  useEffect(() => {
    calculatePosition();
    const optionsContainer = optionContainerRef.current;
    if (!optionsContainer) return;
    return () => {};
  }, [open, calculatePosition]);

  useOnClickOutside(containerRef, (ev) => {
    if (!optionContainerRef.current?.contains(ev.target as Node)) {
      setOpen(false);
    }
  });

  const Options = () => {
    return (
      <div ref={optionContainerRef} className='fixed z-10 flex py-1 text-sm'>
        <div className='w-full overflow-auto rounded border bg-white p-1 shadow'>
          {options.map((option) => {
            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className='flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-gray-200'
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
              >
                <span className='text-lg'> {option.icon}</span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const portal = createPortal(Options(), document.body);

  return (
    <div
      className={twMerge(
        'rounded px-4 py-1 hover:bg-gray-100',
        open ? 'bg-gray-100' : ''
      )}
      ref={containerRef}
    >
      <div
        onClick={() => setOpen(!open)}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        className='flex cursor-pointer items-center gap-2 text-sm'
      >
        {!selectedOption ? (
          placeholder
        ) : (
          <>
            {selectedOption.icon}
            {selectedOption.label}
          </>
        )}
      </div>
      {open ? portal : null}
    </div>
  );
};

export default Select;
