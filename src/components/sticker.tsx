import { cn } from "#/lib/utils";
import { getShapeClass } from "#/lib/sticker-options";
import { Link } from "@tanstack/react-router";

export function Sticker({
  name,
  color,
  shape,
  href,
  className,
  style,
  onContextMenu,
  shaking,
  onMoveTarget,
  dimmed,
  stagger,
}: {
  name: string;
  color: string;
  shape: string;
  href: string;
  className?: string;
  style?: React.CSSProperties;
  onContextMenu?: (e: React.MouseEvent) => void;
  shaking?: boolean;
  onMoveTarget?: () => void;
  dimmed?: boolean;
  stagger?: number;
}) {
  const shapeClass = getShapeClass(shape);

  const shared = cn(
    "group flex items-center justify-center border-4 border-white cursor-pointer no-underline hover:no-underline",
    "w-28 h-28 sm:w-32 sm:h-32",
    "hover:scale-105 active:scale-95",
    "transition-transform duration-200",
    shaking ? "sticker-shake" : "wobble-hover",
    dimmed && "opacity-40 pointer-events-none",
    shapeClass,
    className,
  );

  const sharedStyle = {
    backgroundColor: color,
    boxShadow:
      "0 2px 6px rgba(61,53,41,0.08), 0 1px 2px rgba(61,53,41,0.06)",
    ...(stagger != null ? { "--stagger": stagger } as React.CSSProperties : {}),
    ...style,
  };

  const label = (
    <span className="font-display font-bold text-sm sm:text-base text-center leading-tight px-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
      {name}
    </span>
  );

  // In move mode, shaking stickers become buttons instead of links
  if (shaking && onMoveTarget) {
    return (
      <button
        type="button"
        onClick={onMoveTarget}
        className={shared}
        style={sharedStyle}
      >
        {label}
      </button>
    );
  }

  return (
    <Link
      to={href}
      onContextMenu={onContextMenu}
      className={shared}
      style={sharedStyle}
    >
      {label}
    </Link>
  );
}
