"use client";

import { useEffect, useRef } from "react";
import { createFocusTrap, type FocusTrap } from "focus-trap";

export function useFocusTrap(isActive: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  const trapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isActive) {
      trapRef.current = createFocusTrap(el, {
        escapeDeactivates: false,
        allowOutsideClick: true,
      });
      try {
        trapRef.current.activate();
      } catch {
        // Focus trap activation can fail if no focusable elements exist
      }
    } else {
      trapRef.current?.deactivate({ returnFocus: false });
      trapRef.current = null;
    }

    return () => {
      trapRef.current?.deactivate({ returnFocus: false });
      trapRef.current = null;
    };
  }, [isActive]);

  return ref;
}
