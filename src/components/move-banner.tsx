export function MoveBanner({
  name,
  onCancel,
}: {
  name: string;
  onCancel: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 move-mode-banner flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-5 py-3 rounded-2xl sm:rounded-full border-4 border-white bg-card font-display text-sm shadow-lg text-center">
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
