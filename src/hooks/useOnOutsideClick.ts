import { RefObject, useEffect } from 'react';

export function useOnClickOutside(
  ref: RefObject<HTMLElement>,
  handler: (ev: Event) => void
) {
  useEffect(() => {
    const listener = (ev: Event) => {
      if (!ref.current || ref.current.contains(ev.target as Node)) {
        return;
      }
      handler(ev);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
