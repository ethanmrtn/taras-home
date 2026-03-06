import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { authClient } from "#/lib/auth-client";
import { Sticker } from "#/components/sticker";
import { StickerLoader } from "#/components/sticker-loader";
import { StickerPage } from "#/components/sticker-page";
import { StickerFormDialog } from "#/components/sticker-form";
import { FloatingMenu } from "#/components/floating-menu";
import { DeleteConfirmDialog } from "#/components/delete-confirm-dialog";
import { MoveBanner } from "#/components/move-banner";
import { useContextMenu } from "#/hooks/use-context-menu";

const ADMIN_EMAIL = "ethan.martin@hey.com";

const displayType = (t: string) =>
  t === "merchant" ? "brand" : t;

export const Route = createFileRoute("/_app/_authenticated/")({
  component: HomePage,
});

type StickerTarget = {
  type: "room" | "category" | "merchant";
  id: Id<"rooms"> | Id<"categories"> | Id<"merchants">;
  name: string;
  color: string;
  shape: string;
};

function HomePage() {
  const rooms = useQuery(api.functions.rooms.get);
  const roomlessCategories = useQuery(api.functions.categories.getWithoutRoom);
  const roomlessMerchants = useQuery(api.functions.merchants.getWithoutRoom);
  const createRoom = useMutation(api.functions.rooms.createRoom);
  const updateRoom = useMutation(api.functions.rooms.update);
  const removeRoom = useMutation(api.functions.rooms.remove);
  const createCategory = useMutation(api.functions.categories.createCategory);
  const updateCategory = useMutation(api.functions.categories.update);
  const removeCategory = useMutation(api.functions.categories.remove);
  const createMerchant = useMutation(api.functions.merchants.create);
  const updateMerchant = useMutation(api.functions.merchants.update);
  const removeMerchant = useMutation(api.functions.merchants.remove);

  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  const createInvite = useMutation(api.functions.invites.create);

  const menu = useContextMenu<StickerTarget>();
  const [createType, setCreateType] = useState<
    "room" | "category" | "merchant" | null
  >(null);
  const [editing, setEditing] = useState<StickerTarget | null>(null);
  const [deleting, setDeleting] = useState<StickerTarget | null>(null);
  const [moving, setMoving] = useState<StickerTarget | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  // Escape key cancels move mode
  useEffect(() => {
    if (!moving) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoving(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [moving]);

  if (
    rooms === undefined ||
    roomlessCategories === undefined ||
    roomlessMerchants === undefined
  ) {
    return (
      <main className="page-wrap py-8">
        <h1 className="font-display text-3xl font-bold text-center mb-10">
          Tara's home
        </h1>
        <StickerLoader />
      </main>
    );
  }

  const allStickers = [
    ...rooms.map((room) => ({
      type: "room" as const,
      id: room._id as string,
      name: room.name,
      color: room.color,
      shape: room.shape,
      href: `/rooms/${room._id}`,
    })),
    ...roomlessCategories.map((cat) => ({
      type: "category" as const,
      id: cat._id as string,
      name: cat.name,
      color: cat.color,
      shape: cat.shape,
      href: `/categories/${cat._id}`,
    })),
    ...roomlessMerchants.map((m) => ({
      type: "merchant" as const,
      id: m._id as string,
      name: m.name,
      color: m.color,
      shape: m.shape,
      href: `/merchants/${m._id}`,
    })),
  ];

  // Move targets: categories can move into rooms, merchants can move into rooms or categories
  const isMoveTarget = (s: (typeof allStickers)[number]) => {
    if (!moving) return false;
    if (s.id === moving.id) return false;
    if (moving.type === "category") return s.type === "room";
    if (moving.type === "merchant")
      return s.type === "room" || s.type === "category";
    return false;
  };

  const handleMoveInto = async (targetId: string, targetType: string) => {
    if (!moving) return;
    if (moving.type === "category" && targetType === "room") {
      await updateCategory({
        id: moving.id as Id<"categories">,
        name: moving.name,
        color: moving.color,
        shape: moving.shape,
        room: targetId as Id<"rooms">,
      });
    } else if (moving.type === "merchant" && targetType === "room") {
      const m = roomlessMerchants.find((m) => m._id === moving.id);
      await updateMerchant({
        id: moving.id as Id<"merchants">,
        name: moving.name,
        color: moving.color,
        shape: moving.shape,
        url: m?.url ?? "",
        rooms: [...(m?.rooms ?? []), targetId as Id<"rooms">],
        categories: m?.categories,
      });
    } else if (moving.type === "merchant" && targetType === "category") {
      const m = roomlessMerchants.find((m) => m._id === moving.id);
      const cat = roomlessCategories.find((c) => c._id === targetId);
      await updateMerchant({
        id: moving.id as Id<"merchants">,
        name: moving.name,
        color: moving.color,
        shape: moving.shape,
        url: m?.url ?? "",
        rooms: cat?.room ? [...(m?.rooms ?? []), cat.room] : m?.rooms,
        categories: [...(m?.categories ?? []), targetId as Id<"categories">],
      });
    }
    setMoving(null);
  };

  const menuItems = menu.state.target
    ? [
        {
          label: `Edit ${displayType(menu.state.target.type)}`,
          onClick: () => setEditing(menu.state.target),
        },
        ...(menu.state.target.type !== "room"
          ? [
              {
                label: `Move ${displayType(menu.state.target.type)}`,
                onClick: () => setMoving(menu.state.target),
              },
            ]
          : []),
        { separator: true as const },
        {
          label: `Delete ${displayType(menu.state.target.type)}`,
          variant: "destructive" as const,
          onClick: () => setDeleting(menu.state.target),
        },
      ]
    : [
        { label: "New room", onClick: () => setCreateType("room") },
        { label: "New category", onClick: () => setCreateType("category") },
        { label: "New brand", onClick: () => setCreateType("merchant") },
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
      onTouchStart={(e) => {
        if (moving) return;
        menu.handleTouchStart(e);
      }}
      onTouchEnd={menu.handleTouchEnd}
      onTouchMove={menu.handleTouchMove}
    >
      <h1 className="font-display text-3xl font-bold text-center mb-10">
        Tara's home
        {isAdmin && (
          <button
            type="button"
            title={inviteLink ? "Copied!" : "Generate invite link"}
            onClick={async () => {
              const code = await createInvite();
              const link = `${window.location.origin}/signup?code=${code}`;
              await navigator.clipboard.writeText(link);
              setInviteLink(link);
              setTimeout(() => setInviteLink(null), 2000);
            }}
            className="inline-block w-2.5 h-2.5 rounded-full border-2 border-white cursor-pointer hover:scale-150 transition-transform ml-0.5 align-baseline"
            style={{ backgroundColor: inviteLink ? "#B5EAD7" : "#C7CEEA" }}
          />
        )}
      </h1>

      {allStickers.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">
          <span className="hint-click">Right-click</span>
          <span className="hint-touch">Hold down</span> to add your rooms
        </p>
      ) : (
        <StickerPage seed={7}>
          {allStickers.map((s) => (
            <Sticker
              key={s.id}
              name={s.name}
              color={s.color}
              shape={s.shape}
              href={s.href}
              shaking={isMoveTarget(s)}
              onMoveTarget={() => handleMoveInto(s.id, s.type)}
              dimmed={moving !== null && !isMoveTarget(s) && s.id !== moving.id}
              onContextMenu={(e) =>
                menu.handleContextMenu(e, {
                  type: s.type,
                  id: s.id as Id<"rooms"> | Id<"categories"> | Id<"merchants">,
                  name: s.name,
                  color: s.color,
                  shape: s.shape,
                })
              }
              onTouchStart={(e) =>
                menu.handleTouchStart(e, {
                  type: s.type,
                  id: s.id as Id<"rooms"> | Id<"categories"> | Id<"merchants">,
                  name: s.name,
                  color: s.color,
                  shape: s.shape,
                })
              }
              onTouchEnd={menu.handleTouchEnd}
              onTouchMove={menu.handleTouchMove}
              didLongPressRef={menu.didLongPressRef}
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
        open={createType === "merchant"}
        onOpenChange={(open) => !open && setCreateType(null)}
        title="New brand"
        onSubmit={async (data) => {
          await createMerchant({ ...data, url: "" });
          setCreateType(null);
        }}
      />

      <StickerFormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing ? `Edit ${displayType(editing.type)}` : "Edit"}
        initial={editing ?? undefined}
        submitLabel="Save"
        onSubmit={async (data) => {
          if (!editing) return;
          if (editing.type === "room") {
            await updateRoom({ id: editing.id as Id<"rooms">, ...data });
          } else if (editing.type === "category") {
            await updateCategory({
              id: editing.id as Id<"categories">,
              ...data,
            });
          } else {
            const m = roomlessMerchants.find((m) => m._id === editing.id);
            await updateMerchant({
              id: editing.id as Id<"merchants">,
              ...data,
              url: m?.url ?? "",
              rooms: m?.rooms,
              categories: m?.categories,
            });
          }
          setEditing(null);
        }}
      />

      <DeleteConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        name={deleting?.name ?? ""}
        type={displayType(deleting?.type ?? "room")}
        onConfirm={async () => {
          if (!deleting) return;
          if (deleting.type === "room") {
            await removeRoom({ id: deleting.id as Id<"rooms"> });
          } else if (deleting.type === "category") {
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
