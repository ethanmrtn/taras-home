import { useMemo } from "react";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function StickerPage({
  children,
  seed = 42,
}: {
  children: React.ReactNode[];
  seed?: number;
}) {
  const positions = useMemo(() => {
    const rand = seededRandom(seed);
    const count = children.length;

    // Create a grid of cells and scatter within each
    const cols = Math.max(2, Math.ceil(Math.sqrt(count * 1.5)));
    const rows = Math.ceil(count / cols);
    const cellW = 100 / cols;
    const cellH = 100 / rows;

    return children.map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Random position within cell, with padding to avoid edges
      const pad = 15;
      const x = col * cellW + pad + rand() * (cellW - pad * 2);
      const y = row * cellH + pad + rand() * (cellH - pad * 2);
      const rotate = (rand() - 0.5) * 8; // -4 to 4 degrees

      return { x, y, rotate };
    });
  }, [children.length, seed]);

  return (
    <div className="relative w-full" style={{ minHeight: "70vh" }}>
      {children.map((child, i) => {
        const pos = positions[i];
        if (!pos) return child;
        return (
          <div
            key={i}
            className="absolute sticker-enter"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              rotate: `${pos.rotate}deg`,
              transform: "translate(-50%, -50%)",
              "--stagger": i,
            } as React.CSSProperties}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
