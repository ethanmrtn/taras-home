import { useState, useCallback, useRef } from "react";

type ContextMenuState<T> = {
  open: boolean;
  position: { x: number; y: number };
  target: T | null;
};

const LONG_PRESS_MS = 500;

export function useContextMenu<T>() {
  const [state, setState] = useState<ContextMenuState<T>>({
    open: false,
    position: { x: 0, y: 0 },
    target: null,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPressRef = useRef(false);

  const open = useCallback((x: number, y: number, target: T | null) => {
    setState({ open: true, position: { x, y }, target });
  }, []);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, target: T | null = null) => {
      e.preventDefault();
      e.stopPropagation();
      open(e.clientX, e.clientY, target);
    },
    [open],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, target: T | null = null) => {
      didLongPressRef.current = false;
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      timerRef.current = setTimeout(() => {
        didLongPressRef.current = true;
        open(x, y, target);
      }, LONG_PRESS_MS);
    },
    [open],
  );

  const handleTouchEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    state,
    handleContextMenu,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    didLongPressRef,
    close,
  };
}
