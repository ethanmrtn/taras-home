import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const createItem = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    shape: v.string(),
    merchant: v.id("merchants"),
    imageUrl: v.optional(v.string()),
    price: v.float64(),
    room: v.optional(v.id("rooms")),
    category: v.optional(v.id("categories")),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("items", { ...args });
  },
});

export const getById = query({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("items")
      .withIndex("by_category_id", (q) => q.eq("category", args.categoryId))
      .collect();
  },
});

export const getByMerchant = query({
  args: { merchantId: v.id("merchants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("items")
      .withIndex("by_merchant_id", (q) => q.eq("merchant", args.merchantId))
      .collect();
  },
});

export const getByRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("items")
      .withIndex("by_room_id", (q) => q.eq("room", args.roomId))
      .collect();
  },
});
