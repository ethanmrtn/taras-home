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

export const Route = createFileRoute("/_app/_authenticated/rooms/$roomId")({
  component: RoomPage,
});

type CategoryTarget = {
  id: Id<"categories">;
  name: string;
  color: string;
  shape: string;
};

function RoomPage() {
  const { roomId } = Route.useParams();
  const room = useQuery(api.functions.rooms.get);
  const categories = useQuery(api.functions.categories.getByRoom, {
    roomId: roomId as Id<"rooms">,
  });
  const createCategory = useMutation(api.functions.categories.createCategory);
  const updateCategory = useMutation(api.functions.categories.update);
  const removeCategory = useMutation(api.functions.categories.remove);

  const currentRoom = room?.find((r) => r._id === roomId);
  const menu = useContextMenu<CategoryTarget>();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<CategoryTarget | null>(null);
  const [deleting, setDeleting] = useState<CategoryTarget | null>(null);

  if (categories === undefined) {
    return (
      <main className="page-wrap py-8">
        <StickerLoader />
      </main>
    );
  }

  const menuItems = menu.state.target
    ? [
        {
          label: "Edit category",
          onClick: () => setEditing(menu.state.target),
        },
        { separator: true as const },
        {
          label: "Delete category",
          variant: "destructive" as const,
          onClick: () => setDeleting(menu.state.target),
        },
      ]
    : [{ label: "New category", onClick: () => setCreating(true) }];

  return (
    <main
      className="page-wrap py-8 page-enter"
      onContextMenu={(e) => menu.handleContextMenu(e)}
    >
      <h1 className="font-display text-3xl font-bold text-center mb-10">
        {currentRoom?.name || "Room"}
      </h1>
      {categories.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">
          Right-click to add a category
        </p>
      ) : (
        <StickerPage seed={roomId.charCodeAt(0)}>
          {categories.map((cat) => (
            <Sticker
              key={cat._id}
              name={cat.name}
              color={cat.color}
              shape={cat.shape}
              href={`/categories/${cat._id}`}
              onContextMenu={(e) =>
                menu.handleContextMenu(e, {
                  id: cat._id,
                  name: cat.name,
                  color: cat.color,
                  shape: cat.shape,
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
        title="New category"
        onSubmit={async (data) => {
          await createCategory({ ...data, room: roomId as Id<"rooms"> });
          setCreating(false);
        }}
      />

      <StickerFormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Edit category"
        initial={editing ?? undefined}
        submitLabel="Save"
        onSubmit={async (data) => {
          if (!editing) return;
          await updateCategory({
            id: editing.id,
            ...data,
            room: roomId as Id<"rooms">,
          });
          setEditing(null);
        }}
      />

      <DeleteConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        name={deleting?.name ?? ""}
        type="category"
        onConfirm={async () => {
          if (!deleting) return;
          await removeCategory({ id: deleting.id });
          setDeleting(null);
        }}
      />
    </main>
  );
}
