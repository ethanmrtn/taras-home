import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Sticker } from "#/components/sticker";
import { StickerLoader } from "#/components/sticker-loader";
import { StickerPage } from "#/components/sticker-page";
import { StickerFormDialog } from "#/components/sticker-form";
import { FloatingMenu } from "#/components/floating-menu";
import { DeleteConfirmDialog } from "#/components/delete-confirm-dialog";
import { useContextMenu } from "#/hooks/use-context-menu";

export const Route = createFileRoute("/_app/_authenticated/")({
  component: HomePage,
});

type StickerTarget = {
  type: "room" | "category";
  id: Id<"rooms"> | Id<"categories">;
  name: string;
  color: string;
  shape: string;
};

function HomePage() {
  const rooms = useQuery(api.functions.rooms.get);
  const roomlessCategories = useQuery(api.functions.categories.getWithoutRoom);
  const createRoom = useMutation(api.functions.rooms.createRoom);
  const updateRoom = useMutation(api.functions.rooms.update);
  const removeRoom = useMutation(api.functions.rooms.remove);
  const createCategory = useMutation(api.functions.categories.createCategory);
  const updateCategory = useMutation(api.functions.categories.update);
  const removeCategory = useMutation(api.functions.categories.remove);

  const menu = useContextMenu<StickerTarget>();
  const [createType, setCreateType] = useState<"room" | "category" | null>(
    null,
  );
  const [editing, setEditing] = useState<StickerTarget | null>(null);
  const [deleting, setDeleting] = useState<StickerTarget | null>(null);

  if (rooms === undefined || roomlessCategories === undefined) {
    return (
      <main className="page-wrap py-8">
        <h1 className="font-display text-3xl font-bold text-center mb-10">
          Tara's home
        </h1>
        <StickerLoader />
      </main>
    );
  }

  const menuItems = menu.state.target
    ? [
        {
          label: `Edit ${menu.state.target.type}`,
          onClick: () => setEditing(menu.state.target),
        },
        { separator: true as const },
        {
          label: `Delete ${menu.state.target.type}`,
          variant: "destructive" as const,
          onClick: () => setDeleting(menu.state.target),
        },
      ]
    : [
        { label: "New room", onClick: () => setCreateType("room") },
        { label: "New category", onClick: () => setCreateType("category") },
      ];

  return (
    <main
      className="page-wrap py-8 page-enter"
      onContextMenu={(e) => menu.handleContextMenu(e)}
    >
      <h1 className="font-display text-3xl font-bold text-center mb-10">
        Tara's home
      </h1>
      {rooms.length === 0 && roomlessCategories.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">
          Right-click to add rooms or categories
        </p>
      ) : (
        <StickerPage seed={7}>
          {[
            ...rooms.map((room) => (
              <Sticker
                key={room._id}
                name={room.name}
                color={room.color}
                shape={room.shape}
                href={`/rooms/${room._id}`}
                onContextMenu={(e) =>
                  menu.handleContextMenu(e, {
                    type: "room",
                    id: room._id,
                    name: room.name,
                    color: room.color,
                    shape: room.shape,
                  })
                }
              />
            )),
            ...roomlessCategories.map((cat) => (
              <Sticker
                key={cat._id}
                name={cat.name}
                color={cat.color}
                shape={cat.shape}
                href={`/categories/${cat._id}`}
                onContextMenu={(e) =>
                  menu.handleContextMenu(e, {
                    type: "category",
                    id: cat._id,
                    name: cat.name,
                    color: cat.color,
                    shape: cat.shape,
                  })
                }
              />
            )),
          ]}
        </StickerPage>
      )}

      <FloatingMenu
        open={menu.state.open}
        position={menu.state.position}
        items={menuItems}
        onClose={menu.close}
      />

      <StickerFormDialog
        open={createType === "room"}
        onOpenChange={(open) => !open && setCreateType(null)}
        title="New room"
        onSubmit={async (data) => {
          await createRoom(data);
          setCreateType(null);
        }}
      />

      <StickerFormDialog
        open={createType === "category"}
        onOpenChange={(open) => !open && setCreateType(null)}
        title="New category"
        onSubmit={async (data) => {
          await createCategory(data);
          setCreateType(null);
        }}
      />

      <StickerFormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing ? `Edit ${editing.type}` : "Edit"}
        initial={editing ?? undefined}
        submitLabel="Save"
        onSubmit={async (data) => {
          if (!editing) return;
          if (editing.type === "room") {
            await updateRoom({ id: editing.id as Id<"rooms">, ...data });
          } else {
            await updateCategory({
              id: editing.id as Id<"categories">,
              ...data,
            });
          }
          setEditing(null);
        }}
      />

      <DeleteConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        name={deleting?.name ?? ""}
        type={deleting?.type ?? "room"}
        onConfirm={async () => {
          if (!deleting) return;
          if (deleting.type === "room") {
            await removeRoom({ id: deleting.id as Id<"rooms"> });
          } else {
            await removeCategory({
              id: deleting.id as Id<"categories">,
            });
          }
          setDeleting(null);
        }}
      />
    </main>
  );
}
