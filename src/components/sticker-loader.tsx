export function StickerLoader() {
  return (
    <div className="flex items-center justify-center gap-3 min-h-[60vh]">
      {["var(--sticker-pink)", "var(--sticker-mint)", "var(--sticker-lavender)"].map(
        (color, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full border-2 border-white sticker-bounce"
            style={{
              backgroundColor: color,
              boxShadow: "0 2px 4px rgba(61,53,41,0.08)",
              "--stagger": i,
            } as React.CSSProperties}
          />
        ),
      )}
    </div>
  );
}
