import { useState } from "react";
import { createPortal } from "react-dom";

type AddItem = { label: string; onClick: () => void };

export function MobileAddButton({ items }: { items: AddItem[] }) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const handleFabTap = () => {
    if (items.length === 1) {
      items[0].onClick();
    } else {
      setExpanded((v) => !v);
    }
  };

  return createPortal(
    <>
      {/* Backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setExpanded(false)}
        />
      )}

      <div className="touch-only fixed bottom-6 right-6 z-40 flex-col items-end gap-3">
        {/* Expanded options */}
        {expanded &&
          items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setExpanded(false);
                item.onClick();
              }}
              className="px-4 py-2 rounded-full border-4 border-white bg-card font-display font-semibold text-sm shadow-md cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
              style={{
                boxShadow:
                  "0 2px 6px rgba(61,53,41,0.08), 0 1px 2px rgba(61,53,41,0.06)",
              }}
            >
              {item.label}
            </button>
          ))}

        {/* FAB */}
        <button
          type="button"
          onClick={handleFabTap}
          className="w-14 h-14 rounded-full border-4 border-white bg-primary font-display text-2xl font-bold text-white shadow-md cursor-pointer transition-transform duration-200 flex items-center justify-center"
          style={{
            boxShadow:
              "0 4px 12px rgba(61,53,41,0.12), 0 2px 4px rgba(61,53,41,0.08)",
            rotate: expanded ? "45deg" : "0deg",
          }}
        >
          +
        </button>
      </div>
    </>,
    document.body,
  );
}
