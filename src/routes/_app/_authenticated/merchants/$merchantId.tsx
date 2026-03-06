import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Sticker } from "#/components/sticker";
import { StickerLoader } from "#/components/sticker-loader";
import { StickerPage } from "#/components/sticker-page";
import { ItemFormDialog } from "#/components/item-form";
import { FloatingMenu } from "#/components/floating-menu";
import { DeleteConfirmDialog } from "#/components/delete-confirm-dialog";
import { useContextMenu } from "#/hooks/use-context-menu";
import { getShapeClass } from "#/lib/sticker-options";
import { cn } from "#/lib/utils";

export const Route = createFileRoute(
  "/_app/_authenticated/merchants/$merchantId",
)({
  component: MerchantPage,
});

type ItemTarget = {
  id: Id<"items">;
  name: string;
  color: string;
  shape: string;
  price: number;
  url: string;
  merchant: Id<"merchants">;
};

function MerchantPage() {
  const { merchantId } = Route.useParams();
  const merchant = useQuery(api.functions.merchants.getById, {
    id: merchantId as Id<"merchants">,
  });
  const items = useQuery(api.functions.items.getByMerchant, {
    merchantId: merchantId as Id<"merchants">,
  });
  const createItem = useMutation(api.functions.items.createItem);
  const updateItem = useMutation(api.functions.items.update);
  const removeItem = useMutation(api.functions.items.remove);

  const menu = useContextMenu<ItemTarget>();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ItemTarget | null>(null);
  const [deleting, setDeleting] = useState<ItemTarget | null>(null);

  if (merchant === undefined || items === undefined) {
    return (
      <main className="page-wrap py-8">
        <StickerLoader />
      </main>
    );
  }

  if (merchant === null) {
    return (
      <main className="page-wrap py-8">
        <p className="text-center text-muted-foreground">Brand not found</p>
      </main>
    );
  }

  const menuItems = menu.state.target
    ? [
        {
          label: "Edit thing",
          onClick: () => setEditing(menu.state.target),
        },
        { separator: true as const },
        {
          label: "Delete thing",
          variant: "destructive" as const,
          onClick: () => setDeleting(menu.state.target),
        },
      ]
    : [{ label: "New thing", onClick: () => setCreating(true) }];

  return (
    <main
      className="page-wrap py-8 page-enter"
      onContextMenu={(e) => menu.handleContextMenu(e)}
      onTouchStart={(e) => menu.handleTouchStart(e)}
      onTouchEnd={menu.handleTouchEnd}
      onTouchMove={menu.handleTouchMove}
    >
      {/* Merchant info card */}
      <div className="flex flex-col items-center gap-4 mb-10 item-enter">
        <div
          className={cn(
            "w-24 h-24 border-4 border-white flex items-center justify-center",
            getShapeClass(merchant.shape),
          )}
          style={{
            backgroundColor: merchant.color,
            boxShadow:
              "0 2px 6px rgba(61,53,41,0.08), 0 1px 2px rgba(61,53,41,0.06)",
          }}
        >
          <span className="font-display font-bold text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] text-center leading-tight px-1">
            {merchant.name}
          </span>
        </div>

        <h1 className="font-display text-3xl font-bold">{merchant.name}</h1>

        {merchant.notes && (
          <p className="text-center text-muted-foreground max-w-sm">
            {merchant.notes}
          </p>
        )}

        {merchant.url && (
          <a
            href={merchant.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bubble-btn px-6 py-2 font-display font-semibold text-sm"
            style={
              {
                "--btn-bg": merchant.color,
                backgroundColor: merchant.color,
              } as React.CSSProperties
            }
          >
            Visit site
          </a>
        )}
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          <span className="hint-click">Right-click</span>
          <span className="hint-touch">Hold down</span> to add a thing
        </p>
      ) : (
        <StickerPage seed={merchantId.charCodeAt(0)}>
          {items.map((item) => (
            <Sticker
              key={item._id}
              name={item.name}
              color={item.color}
              shape={item.shape}
              href={`/items/${item._id}`}
              onContextMenu={(e) =>
                menu.handleContextMenu(e, {
                  id: item._id,
                  name: item.name,
                  color: item.color,
                  shape: item.shape,
                  price: item.price,
                  url: item.url,
                  merchant: item.merchant,
                })
              }
              onTouchStart={(e) =>
                menu.handleTouchStart(e, {
                  id: item._id,
                  name: item.name,
                  color: item.color,
                  shape: item.shape,
                  price: item.price,
                  url: item.url,
                  merchant: item.merchant,
                })
              }
              onTouchEnd={menu.handleTouchEnd}
              onTouchMove={menu.handleTouchMove}
              didLongPressRef={menu.didLongPressRef}
            />
          ))}
        </StickerPage>
      )}

      <FloatingMenu
        open={menu.state.open}
        position={menu.state.position}
        items={menuItems}
        onClose={menu.close}
      />

      <ItemFormDialog
        open={creating}
        onOpenChange={setCreating}
        title="New thing"
        merchantId={merchantId as Id<"merchants">}
        onSubmit={async (data) => {
          await createItem({
            ...data,
            room: merchant.rooms?.[0],
          });
          setCreating(false);
        }}
      />

      <ItemFormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Edit thing"
        merchantId={merchantId as Id<"merchants">}
        initial={editing ?? undefined}
        submitLabel="Save"
        onSubmit={async (data) => {
          if (!editing) return;
          const item = items.find((i) => i._id === editing.id);
          await updateItem({
            id: editing.id,
            ...data,
            room: item?.room,
            category: item?.category,
          });
          setEditing(null);
        }}
      />

      <DeleteConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        name={deleting?.name ?? ""}
        type="thing"
        onConfirm={async () => {
          if (!deleting) return;
          await removeItem({ id: deleting.id });
          setDeleting(null);
        }}
      />
    </main>
  );
}
