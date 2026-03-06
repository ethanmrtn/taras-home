export const STICKER_COLORS = [
  // Pastels
  { name: "Pink", value: "#FFB7C5" },
  { name: "Mint", value: "#B5EAD7" },
  { name: "Blue", value: "#C7CEEA" },
  { name: "Peach", value: "#FFDAC1" },
  { name: "Lavender", value: "#E2C6E6" },
  { name: "Lemon", value: "#FFF5BA" },
  { name: "Sky", value: "#A0D2F0" },
  { name: "Lilac", value: "#D4B8E0" },
  // Deeper tones
  { name: "Teal", value: "#7cc5b8" },
  { name: "Rose", value: "#f0a0b0" },
  { name: "Sand", value: "#d4a76a" },
  { name: "Coral", value: "#F08080" },
  { name: "Sage", value: "#9CB69C" },
  { name: "Slate", value: "#8E9AAF" },
  { name: "Mauve", value: "#C9A0C9" },
  { name: "Clay", value: "#C2847A" },
];

export const STICKER_SHAPES = [
  { name: "Circle", value: "circle", class: "rounded-full" },
  { name: "Square", value: "rounded-square", class: "rounded-xl" },
  {
    name: "Blob",
    value: "blob",
    class: "rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]",
  },
  {
    name: "Leaf",
    value: "leaf",
    class: "rounded-[50%_10%_50%_10%]",
  },
  {
    name: "Diamond",
    value: "diamond",
    class: "rounded-[10%_50%_10%_50%]",
  },
  {
    name: "Wonky",
    value: "wonky",
    class: "rounded-[20%_60%_30%_70%_/_70%_30%_60%_20%]",
  },
];

export function getShapeClass(shape: string): string {
  return STICKER_SHAPES.find((s) => s.value === shape)?.class ?? "rounded-2xl";
}
