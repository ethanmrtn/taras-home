import { useState, useCallback } from "react";

type ContextMenuState<T> = {
  open: boolean;
  position: { x: number; y: number };
  target: T | null;
};

export function useContextMenu<T>() {
  const [state, setState] = useState<ContextMenuState<T>>({
    open: false,
    position: { x: 0, y: 0 },
    target: null,
  });

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, target: T | null = null) => {
      e.preventDefault();
      e.stopPropagation();
      setState({
        open: true,
        position: { x: e.clientX, y: e.clientY },
        target,
      });
    },
    [],
  );

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return { state, handleContextMenu, close };
}
