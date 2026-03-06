import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Sticker } from "#/components/sticker";
import { StickerLoader } from "#/components/sticker-loader";
import { StickerPage } from "#/components/sticker-page";

export const Route = createFileRoute(
  "/_app/_authenticated/categories/$categoryId",
)({
  component: CategoryPage,
});

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const categories = useQuery(api.functions.categories.get);
  const items = useQuery(api.functions.items.getByCategory, {
    categoryId: categoryId as Id<"categories">,
  });

  const currentCategory = categories?.find((c) => c._id === categoryId);

  if (items === undefined) {
    return (
      <main className="page-wrap py-8">
        <StickerLoader />
      </main>
    );
  }

  return (
    <main className="page-wrap py-8 page-enter">
      <h1 className="font-display text-3xl font-bold text-center mb-10">
        {currentCategory?.name || "Category"}
      </h1>
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No items in this category yet
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
            />
          ))}
        </StickerPage>
      )}
    </main>
  );
}
