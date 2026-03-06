import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
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
  onSubmit,
  submitLabel = "Create",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initial?: Partial<ItemFormData>;
  onSubmit: (data: ItemFormData) => void;
  submitLabel?: string;
}) {
  const merchants = useQuery(api.functions.merchants.get);

  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? STICKER_COLORS[0].value);
  const [shape, setShape] = useState(initial?.shape ?? STICKER_SHAPES[0].value);
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [merchant, setMerchant] = useState<Id<"merchants"> | "">(
    initial?.merchant ?? "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !merchant) return;
    onSubmit({
      name: name.trim(),
      color,
      shape,
      price: Number.parseFloat(price) || 0,
      url: url.trim(),
      merchant: merchant as Id<"merchants">,
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
      setMerchant(initial.merchant ?? "");
    } else if (next && !initial) {
      setName("");
      setColor(STICKER_COLORS[0].value);
      setShape(STICKER_SHAPES[0].value);
      setPrice("");
      setUrl("");
      setMerchant("");
    }
    onOpenChange(next);
  };

  const selectedShapeClass =
    STICKER_SHAPES.find((s) => s.value === shape)?.class ?? "rounded-full";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
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

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="item-price">Price</FieldLabel>
                <Input
                  id="item-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="item-merchant">Store</FieldLabel>
                <select
                  id="item-merchant"
                  value={merchant}
                  onChange={(e) =>
                    setMerchant(e.target.value as Id<"merchants">)
                  }
                  className="sticker flex h-9 w-full bg-white px-3 py-1 text-sm font-display"
                >
                  <option value="">Select...</option>
                  {merchants?.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

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
