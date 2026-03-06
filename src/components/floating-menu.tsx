import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "#/lib/utils";

type MenuItem =
  | { label: string; onClick: () => void; variant?: "default" | "destructive" }
  | { separator: true };

export function FloatingMenu({
  open,
  position,
  items,
  onClose,
}: {
  open: boolean;
  position: { x: number; y: number };
  items: MenuItem[];
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Clamp menu position to stay within viewport
  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const margin = 8;
    let x = position.x;
    let y = position.y;
    if (rect.right > window.innerWidth - margin)
      x = window.innerWidth - rect.width - margin;
    if (rect.bottom > window.innerHeight - margin)
      y = window.innerHeight - rect.height - margin;
    if (x < margin) x = margin;
    if (y < margin) y = margin;
    menuRef.current.style.left = `${x}px`;
    menuRef.current.style.top = `${y}px`;
  }, [open, position]);

  useEffect(() => {
    if (!open) return;

    const handleDismiss = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleScroll = () => onClose();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleDismiss);
    document.addEventListener("touchstart", handleDismiss, { passive: true });
    document.addEventListener("scroll", handleScroll, true);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDismiss);
      document.removeEventListener("touchstart", handleDismiss);
      document.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[8rem] rounded-xl border-4 border-white bg-popover p-1 font-display shadow-md animate-in fade-in-0 zoom-in-95"
      style={{
        left: position.x,
        top: position.y,
        boxShadow:
          "0 4px 12px rgba(61,53,41,0.12), 0 2px 4px rgba(61,53,41,0.08)",
      }}
    >
      {items.map((item, i) =>
        "separator" in item ? (
          <div key={i} className="-mx-1 my-1 h-px bg-border" />
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={cn(
              "flex w-full cursor-pointer items-center rounded-lg px-3 py-1.5 text-sm outline-none select-none transition-colors",
              item.variant === "destructive"
                ? "text-destructive hover:bg-destructive/10"
                : "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {item.label}
          </button>
        ),
      )}
    </div>,
    document.body,
  );
}
