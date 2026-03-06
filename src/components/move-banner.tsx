export function MoveBanner({
  name,
  onCancel,
}: {
  name: string;
  onCancel: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 move-mode-banner flex items-center gap-3 px-5 py-3 rounded-full border-4 border-white bg-card font-display text-sm shadow-lg">
      <span>
        Tap a sticker to move <strong>{name}</strong>
      </span>
      <button
        type="button"
        onClick={onCancel}
        className="px-3 py-1 rounded-full border-2 border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
}
