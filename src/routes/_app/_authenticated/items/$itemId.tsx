import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { StickerLoader } from "#/components/sticker-loader";

export const Route = createFileRoute("/_app/_authenticated/items/$itemId")({
  component: ItemPage,
});

function ItemPage() {
  const { itemId } = Route.useParams();
  const item = useQuery(api.functions.items.getById, {
    id: itemId as Id<"items">,
  });

  if (item === undefined) {
    return (
      <main className="page-wrap py-8">
        <StickerLoader />
      </main>
    );
  }

  if (item === null) {
    return (
      <main className="page-wrap py-8">
        <p className="text-center text-muted-foreground">Item not found</p>
      </main>
    );
  }

  return (
    <main className="page-wrap min-h-[80vh] flex items-center justify-center page-enter">
      <div className="flex flex-col items-center gap-6 item-enter">
        <div
          className="w-36 h-36 rounded-full border-4 border-white flex items-center justify-center"
          style={{
            backgroundColor: item.color,
            boxShadow:
              "0 2px 6px rgba(61,53,41,0.08), 0 1px 2px rgba(61,53,41,0.06)",
          }}
        >
          <span className="font-display font-bold text-lg text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            {item.name}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="font-display text-3xl font-bold">{item.name}</h1>
          <p className="font-display text-xl font-semibold text-muted-foreground">
            ${item.price.toFixed(2)}
          </p>
        </div>

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bubble-btn px-6 py-2 font-display font-semibold text-sm"
            style={
              { "--btn-bg": item.color, backgroundColor: item.color } as React.CSSProperties
            }
          >
            View at store
          </a>
        )}
      </div>
    </main>
  );
}
