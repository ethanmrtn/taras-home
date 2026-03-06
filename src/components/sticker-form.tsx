import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "#/components/ui/dialog";
import { cn } from "#/lib/utils";

const STICKER_COLORS = [
  { name: "Pink", value: "#FFB7C5" },
  { name: "Mint", value: "#B5EAD7" },
  { name: "Blue", value: "#C7CEEA" },
  { name: "Peach", value: "#FFDAC1" },
  { name: "Lavender", value: "#E2C6E6" },
  { name: "Teal", value: "#7cc5b8" },
  { name: "Rose", value: "#f0a0b0" },
  { name: "Sand", value: "#d4a76a" },
];

const STICKER_SHAPES = [
  { name: "Circle", value: "circle", class: "rounded-full" },
  { name: "Square", value: "rounded-square", class: "rounded-lg" },
  { name: "Cloud", value: "cloud", class: "rounded-[40%]" },
  {
    name: "Blob",
    value: "blob",
    class: "rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]",
  },
];

type StickerFormData = {
  name: string;
  color: string;
  shape: string;
};

export function StickerFormDialog({
  open,
  onOpenChange,
  title,
  description,
  initial,
  onSubmit,
  submitLabel = "Create",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  initial?: StickerFormData;
  onSubmit: (data: StickerFormData) => void;
  submitLabel?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? STICKER_COLORS[0].value);
  const [shape, setShape] = useState(initial?.shape ?? STICKER_SHAPES[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color, shape });
    if (!initial) {
      setName("");
    }
  };

  // Reset form when dialog opens with new initial values
  const handleOpenChange = (next: boolean) => {
    if (next && initial) {
      setName(initial.name);
      setColor(initial.color);
      setShape(initial.shape);
    } else if (next && !initial) {
      setName("");
      setColor(STICKER_COLORS[0].value);
      setShape(STICKER_SHAPES[0].value);
    }
    onOpenChange(next);
  };

  const selectedShapeClass =
    STICKER_SHAPES.find((s) => s.value === shape)?.class ?? "rounded-full";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="item-enter">
        <DialogHeader className="items-center">
          {/* Live preview */}
          <div
            className={cn(
              "w-20 h-20 border-4 border-white flex items-center justify-center mb-2",
              selectedShapeClass,
            )}
            style={{
              backgroundColor: color,
              boxShadow:
                "0 2px 6px rgba(61,53,41,0.08), 0 1px 2px rgba(61,53,41,0.06)",
            }}
          >
            <span className="font-display font-bold text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] text-center leading-tight px-1">
              {name || "..."}
            </span>
          </div>
          <DialogTitle className="font-display">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="sticker-name">Name</FieldLabel>
              <Input
                id="sticker-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kitchen"
                autoFocus
              />
            </Field>

            <Field>
              <FieldLabel>Color</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {STICKER_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110",
                      color === c.value
                        ? "border-foreground scale-110"
                        : "border-white",
                    )}
                    style={{
                      backgroundColor: c.value,
                      boxShadow: "0 1px 3px rgba(61,53,41,0.1)",
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </Field>

            <Field>
              <FieldLabel>Shape</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {STICKER_SHAPES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setShape(s.value)}
                    className={cn(
                      "w-10 h-10 border-2 cursor-pointer transition-transform hover:scale-110",
                      s.class,
                      shape === s.value
                        ? "border-foreground scale-110"
                        : "border-white",
                    )}
                    style={{
                      backgroundColor: color,
                      boxShadow: "0 1px 3px rgba(61,53,41,0.1)",
                    }}
                    title={s.name}
                  />
                ))}
              </div>
            </Field>

            <Button type="submit" className="w-full mt-2">
              {submitLabel}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
