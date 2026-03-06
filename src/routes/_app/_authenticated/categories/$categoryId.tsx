import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Sticker } from "#/components/sticker";
import { StickerLoader } from "#/components/sticker-loader";
import { StickerPage } from "#/components/sticker-page";
import { StickerFormDialog } from "#/components/sticker-form";
import { FloatingMenu } from "#/components/floating-menu";
import { DeleteConfirmDialog } from "#/components/delete-confirm-dialog";
import { useContextMenu } from "#/hooks/use-context-menu";

export const Route = createFileRoute(
  "/_app/_authenticated/categories/$categoryId",
)({
  component: CategoryPage,
});

type MerchantTarget = {
  id: Id<"merchants">;
  name: string;
  color: string;
  shape: string;
};

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const categories = useQuery(api.functions.categories.get);
  const merchants = useQuery(api.functions.merchants.getByCategory, {
    categoryId: categoryId as Id<"categories">,
  });
  const createMerchant = useMutation(api.functions.merchants.create);
  const updateMerchant = useMutation(api.functions.merchants.update);
  const removeMerchant = useMutation(api.functions.merchants.remove);

  const currentCategory = categories?.find((c) => c._id === categoryId);
  const menu = useContextMenu<MerchantTarget>();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<MerchantTarget | null>(null);
  const [deleting, setDeleting] = useState<MerchantTarget | null>(null);

  if (merchants === undefined) {
    return (
      <main className="page-wrap py-8">
        <StickerLoader />
      </main>
    );
  }

  const menuItems = menu.state.target
    ? [
        {
          label: "Edit merchant",
          onClick: () => setEditing(menu.state.target),
        },
        { separator: true as const },
        {
          label: "Delete merchant",
          variant: "destructive" as const,
          onClick: () => setDeleting(menu.state.target),
        },
      ]
    : [{ label: "New merchant", onClick: () => setCreating(true) }];

  return (
    <main
      className="page-wrap py-8 page-enter"
      onContextMenu={(e) => menu.handleContextMenu(e)}
    >
      <h1 className="font-display text-3xl font-bold text-center mb-10">
        {currentCategory?.name || "Category"}
      </h1>
      {merchants.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">
          Right-click to add a brand
        </p>
      ) : (
        <StickerPage seed={categoryId.charCodeAt(0)}>
          {merchants.map((m) => (
            <Sticker
              key={m._id}
              name={m.name}
              color={m.color}
              shape={m.shape}
              href={`/merchants/${m._id}?category=${categoryId}`}
              onContextMenu={(e) =>
                menu.handleContextMenu(e, {
                  id: m._id,
                  name: m.name,
                  color: m.color,
                  shape: m.shape,
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

      <StickerFormDialog
        open={creating}
        onOpenChange={setCreating}
        title="New merchant"
        onSubmit={async (data) => {
          await createMerchant({
            ...data,
            url: "",
            categories: [categoryId as Id<"categories">],
            rooms: currentCategory?.room ? [currentCategory.room] : undefined,
          });
          setCreating(false);
        }}
      />

      <StickerFormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Edit merchant"
        initial={editing ?? undefined}
        submitLabel="Save"
        onSubmit={async (data) => {
          if (!editing) return;
          const merchant = merchants.find((m) => m._id === editing.id);
          await updateMerchant({
            id: editing.id,
            ...data,
            url: merchant?.url ?? "",
            rooms: merchant?.rooms,
            categories: merchant?.categories,
          });
          setEditing(null);
        }}
      />

      <DeleteConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        name={deleting?.name ?? ""}
        type="merchant"
        onConfirm={async () => {
          if (!deleting) return;
          await removeMerchant({ id: deleting.id });
          setDeleting(null);
        }}
      />
    </main>
  );
}
