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
  onEditTap,
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
  onEditTap?: (rect: DOMRect) => void;
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

  const editButton = onEditTap && (
    <button
      type="button"
      className="touch-only absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white border-2 border-border items-center justify-center text-xs font-bold text-muted-foreground shadow-sm z-10 cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
        onEditTap(rect);
      }}
    >
      ···
    </button>
  );

  // In move mode, shaking stickers become buttons instead of links
  if (shaking && onMoveTarget) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={onMoveTarget}
          className={shared}
          style={sharedStyle}
        >
          {label}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {editButton}
      <Link
        to={href}
        onContextMenu={onContextMenu}
        className={shared}
        style={sharedStyle}
      >
        {label}
      </Link>
    </div>
  );
}
