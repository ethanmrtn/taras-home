import { useState, useEffect } from "react";
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
import { MoveBanner } from "#/components/move-banner";
import { useContextMenu } from "#/hooks/use-context-menu";

export const Route = createFileRoute("/_app/_authenticated/rooms/$roomId")({
  component: RoomPage,
});

type StickerTarget = {
  type: "category" | "merchant";
  id: Id<"categories"> | Id<"merchants">;
  name: string;
  color: string;
  shape: string;
};

function RoomPage() {
  const { roomId } = Route.useParams();
  const rooms = useQuery(api.functions.rooms.get);
  const categories = useQuery(api.functions.categories.getByRoom, {
    roomId: roomId as Id<"rooms">,
  });
  const merchants = useQuery(api.functions.merchants.getByRoom, {
    roomId: roomId as Id<"rooms">,
  });
  const createCategory = useMutation(api.functions.categories.createCategory);
  const updateCategory = useMutation(api.functions.categories.update);
  const removeCategory = useMutation(api.functions.categories.remove);
  const createMerchant = useMutation(api.functions.merchants.create);
  const updateMerchant = useMutation(api.functions.merchants.update);
  const removeMerchant = useMutation(api.functions.merchants.remove);

  const currentRoom = rooms?.find((r) => r._id === roomId);
  const menu = useContextMenu<StickerTarget>();
  const [createType, setCreateType] = useState<
    "category" | "merchant" | null
  >(null);
  const [editing, setEditing] = useState<StickerTarget | null>(null);
  const [deleting, setDeleting] = useState<StickerTarget | null>(null);
  const [moving, setMoving] = useState<StickerTarget | null>(null);

  useEffect(() => {
    if (!moving) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoving(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [moving]);

  if (categories === undefined || merchants === undefined) {
    return (
      <main className="page-wrap py-8">
        <StickerLoader />
      </main>
    );
  }

  // Filter out merchants that already belong to a category in this room
  const categoryIds = new Set(categories.map((c) => c._id));
  const uncategorizedMerchants = merchants.filter(
    (m) => !m.categories?.some((catId) => categoryIds.has(catId)),
  );

  const stickers = [
    ...categories.map((cat) => ({
      type: "category" as const,
      id: cat._id as Id<"categories"> | Id<"merchants">,
      name: cat.name,
      color: cat.color,
      shape: cat.shape,
      href: `/categories/${cat._id}`,
    })),
    ...uncategorizedMerchants.map((m) => ({
      type: "merchant" as const,
      id: m._id as Id<"categories"> | Id<"merchants">,
      name: m.name,
      color: m.color,
      shape: m.shape,
      href: `/merchants/${m._id}?room=${roomId}`,
    })),
  ];

  // Merchants can move into categories
  const isMoveTarget = (s: (typeof stickers)[number]) => {
    if (!moving) return false;
    if (s.id === moving.id) return false;
    if (moving.type === "merchant") return s.type === "category";
    return false;
  };

  const handleMoveInto = async (targetId: string) => {
    if (!moving || moving.type !== "merchant") return;
    const m = merchants.find((m) => m._id === moving.id);
    await updateMerchant({
      id: moving.id as Id<"merchants">,
      name: moving.name,
      color: moving.color,
      shape: moving.shape,
      url: m?.url ?? "",
      rooms: m?.rooms,
      categories: [...(m?.categories ?? []), targetId as Id<"categories">],
    });
    setMoving(null);
  };

  const menuItems = menu.state.target
    ? [
        {
          label: `Edit ${menu.state.target.type}`,
          onClick: () => setEditing(menu.state.target),
        },
        ...(menu.state.target.type === "merchant"
          ? [
              {
                label: "Move to category",
                onClick: () => setMoving(menu.state.target),
              },
            ]
          : []),
        { separator: true as const },
        {
          label: `Delete ${menu.state.target.type}`,
          variant: "destructive" as const,
          onClick: () => setDeleting(menu.state.target),
        },
      ]
    : [
        { label: "New category", onClick: () => setCreateType("category") },
        { label: "New merchant", onClick: () => setCreateType("merchant") },
      ];

  return (
    <main
      className="page-wrap py-8 page-enter"
      onContextMenu={(e) => {
        if (moving) {
          e.preventDefault();
          setMoving(null);
          return;
        }
        menu.handleContextMenu(e);
      }}
    >
      <h1 className="font-display text-3xl font-bold text-center mb-10">
        {currentRoom?.name || "Room"}
      </h1>

      {stickers.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">
          Right-click to add a category or merchant
        </p>
      ) : (
        <StickerPage seed={roomId.charCodeAt(0)}>
          {stickers.map((s) => (
            <Sticker
              key={s.id}
              name={s.name}
              color={s.color}
              shape={s.shape}
              href={s.href}
              shaking={isMoveTarget(s)}
              onMoveTarget={() => handleMoveInto(s.id as string)}
              dimmed={moving !== null && !isMoveTarget(s) && s.id !== moving.id}
              onContextMenu={(e) =>
                menu.handleContextMenu(e, {
                  type: s.type,
                  id: s.id,
                  name: s.name,
                  color: s.color,
                  shape: s.shape,
                })
              }
            />
          ))}
        </StickerPage>
      )}

      {moving && (
        <MoveBanner name={moving.name} onCancel={() => setMoving(null)} />
      )}

      {!moving && (
        <FloatingMenu
          open={menu.state.open}
          position={menu.state.position}
          items={menuItems}
          onClose={menu.close}
        />
      )}

      {/* Create category */}
      <StickerFormDialog
        open={createType === "category"}
        onOpenChange={(open) => !open && setCreateType(null)}
        title="New category"
        onSubmit={async (data) => {
          await createCategory({ ...data, room: roomId as Id<"rooms"> });
          setCreateType(null);
        }}
      />

      {/* Create merchant */}
      <StickerFormDialog
        open={createType === "merchant"}
        onOpenChange={(open) => !open && setCreateType(null)}
        title="New merchant"
        onSubmit={async (data) => {
          await createMerchant({
            ...data,
            url: "",
            rooms: [roomId as Id<"rooms">],
          });
          setCreateType(null);
        }}
      />

      {/* Edit */}
      <StickerFormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing ? `Edit ${editing.type}` : "Edit"}
        initial={editing ?? undefined}
        submitLabel="Save"
        onSubmit={async (data) => {
          if (!editing) return;
          if (editing.type === "category") {
            await updateCategory({
              id: editing.id as Id<"categories">,
              ...data,
              room: roomId as Id<"rooms">,
            });
          } else {
            const merchant = merchants.find((m) => m._id === editing.id);
            await updateMerchant({
              id: editing.id as Id<"merchants">,
              ...data,
              url: merchant?.url ?? "",
              rooms: merchant?.rooms,
              categories: merchant?.categories,
            });
          }
          setEditing(null);
        }}
      />

      {/* Delete */}
      <DeleteConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        name={deleting?.name ?? ""}
        type={deleting?.type ?? "category"}
        onConfirm={async () => {
          if (!deleting) return;
          if (deleting.type === "category") {
            await removeCategory({ id: deleting.id as Id<"categories"> });
          } else {
            await removeMerchant({ id: deleting.id as Id<"merchants"> });
          }
          setDeleting(null);
        }}
      />
    </main>
  );
}
