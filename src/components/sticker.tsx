import { cn } from "#/lib/utils";
import { Link } from "@tanstack/react-router";

type StickerShape =
  | "circle"
  | "rounded-square"
  | "star"
  | "heart"
  | "cloud"
  | "blob";

const shapeClasses: Record<StickerShape, string> = {
  circle: "rounded-full",
  "rounded-square": "rounded-2xl",
  star: "rounded-2xl",
  heart: "rounded-2xl",
  cloud: "rounded-[40%]",
  blob: "rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]",
};

export function Sticker({
  name,
  color,
  shape,
  href,
  className,
  style,
}: {
  name: string;
  color: string;
  shape: string;
  href: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const shapeClass = shapeClasses[shape as StickerShape] || "rounded-2xl";

  return (
    <Link
      to={href}
      className={cn(
        "group flex items-center justify-center border-4 border-white cursor-pointer no-underline hover:no-underline",
        "w-28 h-28 sm:w-32 sm:h-32",
        "hover:scale-105 active:scale-95",
        "transition-transform duration-200",
        "wobble-hover",
        shapeClass,
        className,
      )}
      style={{
        backgroundColor: color,
        boxShadow: "0 2px 6px rgba(61,53,41,0.08), 0 1px 2px rgba(61,53,41,0.06)",
        ...style,
      }}
    >
      <span className="font-display font-bold text-sm sm:text-base text-center leading-tight px-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
        {name}
      </span>
    </Link>
  );
}
