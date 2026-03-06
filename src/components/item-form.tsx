import { useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { cn } from "#/lib/utils";
import { STICKER_COLORS, STICKER_SHAPES } from "#/lib/sticker-options";

export type ItemFormData = {
  name: string;
  color: string;
  shape: string;
  price: number;
  url: string;
  merchant: Id<"merchants">;
};

export function ItemFormDialog({
  open,
  onOpenChange,
  title,
  initial,
  merchantId,
  onSubmit,
  submitLabel = "Create",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initial?: Partial<ItemFormData>;
  merchantId: Id<"merchants">;
  onSubmit: (data: ItemFormData) => void;
  submitLabel?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? STICKER_COLORS[0].value);
  const [shape, setShape] = useState(initial?.shape ?? STICKER_SHAPES[0].value);
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      color,
      shape,
      price: Number.parseFloat(price) || 0,
      url: url.trim(),
      merchant: merchantId,
    });
    if (!initial) {
      setName("");
      setPrice("");
      setUrl("");
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (next && initial) {
      setName(initial.name ?? "");
      setColor(initial.color ?? STICKER_COLORS[0].value);
      setShape(initial.shape ?? STICKER_SHAPES[0].value);
      setPrice(initial.price?.toString() ?? "");
      setUrl(initial.url ?? "");
    } else if (next && !initial) {
      setName("");
      setColor(STICKER_COLORS[0].value);
      setShape(STICKER_SHAPES[0].value);
      setPrice("");
      setUrl("");
    }
    onOpenChange(next);
  };

  const selectedShapeClass =
    STICKER_SHAPES.find((s) => s.value === shape)?.class ?? "rounded-full";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="items-center">
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
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left column — text fields */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="item-name">Name</FieldLabel>
                <Input
                  id="item-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Toaster"
                  autoFocus
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="item-price">Price</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-display font-semibold text-muted-foreground text-sm pointer-events-none">
                    $
                  </span>
                  <Input
                    id="item-price"
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) {
                        setPrice(v);
                      }
                    }}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="item-url">URL</FieldLabel>
                <Input
                  id="item-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                />
              </Field>
            </FieldGroup>

            {/* Right column — visual pickers */}
            <FieldGroup>
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
            </FieldGroup>
          </div>

          <Button type="submit" className="w-full mt-6">
            {submitLabel}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
