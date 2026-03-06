import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Sticker } from "#/components/sticker";
import { StickerLoader } from "#/components/sticker-loader";
import { StickerPage } from "#/components/sticker-page";

export const Route = createFileRoute("/_app/_authenticated/rooms/$roomId")({
  component: RoomPage,
});

function RoomPage() {
  const { roomId } = Route.useParams();
  const room = useQuery(api.functions.rooms.get);
  const categories = useQuery(api.functions.categories.getByRoom, {
    roomId: roomId as Id<"rooms">,
  });

  const currentRoom = room?.find((r) => r._id === roomId);

  if (categories === undefined) {
    return (
      <main className="page-wrap py-8">
        <StickerLoader />
      </main>
    );
  }

  return (
    <main className="page-wrap py-8 page-enter">
      <h1 className="font-display text-3xl font-bold text-center mb-10">
        {currentRoom?.name || "Room"}
      </h1>
      {categories.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No categories in this room yet
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
            />
          ))}
        </StickerPage>
      )}
    </main>
  );
}
