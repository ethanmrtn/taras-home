import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Sticker } from "#/components/sticker";
import { StickerLoader } from "#/components/sticker-loader";
import { StickerPage } from "#/components/sticker-page";
import { ItemFormDialog, type ItemFormData } from "#/components/item-form";
import { FloatingMenu } from "#/components/floating-menu";
import { DeleteConfirmDialog } from "#/components/delete-confirm-dialog";
import { useContextMenu } from "#/hooks/use-context-menu";

export const Route = createFileRoute(
  "/_app/_authenticated/categories/$categoryId",
)({
  component: CategoryPage,
});

type ItemTarget = {
  id: Id<"items">;
  name: string;
  color: string;
  shape: string;
  price: number;
  url: string;
  merchant: Id<"merchants">;
  room?: Id<"rooms">;
};

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const categories = useQuery(api.functions.categories.get);
  const items = useQuery(api.functions.items.getByCategory, {
    categoryId: categoryId as Id<"categories">,
  });
  const createItem = useMutation(api.functions.items.createItem);
  const updateItem = useMutation(api.functions.items.update);
  const removeItem = useMutation(api.functions.items.remove);

  const currentCategory = categories?.find((c) => c._id === categoryId);
  const menu = useContextMenu<ItemTarget>();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ItemTarget | null>(null);
  const [deleting, setDeleting] = useState<ItemTarget | null>(null);

  if (items === undefined) {
    return (
      <main className="page-wrap py-8">
        <StickerLoader />
      </main>
    );
  }

  const menuItems = menu.state.target
    ? [
        {
          label: "Edit item",
          onClick: () => setEditing(menu.state.target),
        },
        { separator: true as const },
        {
          label: "Delete item",
          variant: "destructive" as const,
          onClick: () => setDeleting(menu.state.target),
        },
      ]
    : [{ label: "New item", onClick: () => setCreating(true) }];

  const handleCreate = async (data: ItemFormData) => {
    await createItem({
      ...data,
      category: categoryId as Id<"categories">,
      room: currentCategory?.room,
    });
    setCreating(false);
  };

  const handleUpdate = async (data: ItemFormData) => {
    if (!editing) return;
    await updateItem({
      id: editing.id,
      ...data,
      category: categoryId as Id<"categories">,
      room: editing.room,
    });
    setEditing(null);
  };

  return (
    <main
      className="page-wrap py-8 page-enter"
      onContextMenu={(e) => menu.handleContextMenu(e)}
    >
      <h1 className="font-display text-3xl font-bold text-center mb-10">
        {currentCategory?.name || "Category"}
      </h1>
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">
          Right-click to add an item
        </p>
      ) : (
        <StickerPage seed={categoryId.charCodeAt(0)}>
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
                  room: item.room,
                })
              }
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
        title="New item"
        onSubmit={handleCreate}
      />

      <ItemFormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Edit item"
        initial={editing ?? undefined}
        submitLabel="Save"
        onSubmit={handleUpdate}
      />

      <DeleteConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        name={deleting?.name ?? ""}
        type="item"
        onConfirm={async () => {
          if (!deleting) return;
          await removeItem({ id: deleting.id });
          setDeleting(null);
        }}
      />
    </main>
  );
}
