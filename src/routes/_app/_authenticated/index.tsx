import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Sticker } from "#/components/sticker";
import { StickerLoader } from "#/components/sticker-loader";
import { StickerPage } from "#/components/sticker-page";

export const Route = createFileRoute("/_app/_authenticated/")({
  component: HomePage,
});

function HomePage() {
  const rooms = useQuery(api.functions.rooms.get);
  const roomlessCategories = useQuery(api.functions.categories.getWithoutRoom);

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

  const stickers = [
    ...rooms.map((room) => ({
      id: room._id,
      name: room.name,
      color: room.color,
      shape: room.shape,
      href: `/rooms/${room._id}`,
    })),
    ...roomlessCategories.map((cat) => ({
      id: cat._id,
      name: cat.name,
      color: cat.color,
      shape: cat.shape,
      href: `/categories/${cat._id}`,
    })),
  ];

  return (
    <main className="page-wrap py-8 page-enter">
      <h1 className="font-display text-3xl font-bold text-center mb-10">
        Tara's home
      </h1>
      {stickers.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No rooms or categories yet
        </p>
      ) : (
        <StickerPage seed={7}>
          {stickers.map((s) => (
            <Sticker
              key={s.id}
              name={s.name}
              color={s.color}
              shape={s.shape}
              href={s.href}
            />
          ))}
        </StickerPage>
      )}
    </main>
  );
}
