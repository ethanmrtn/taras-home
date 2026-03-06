import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const createMerchant = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    shape: v.string(),
    url: v.string(),
    category: v.optional(v.id("categories")),
    room: v.optional(v.id("rooms")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("merchants", { ...args });
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("merchants").collect();
  },
});

export const getByRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("merchants")
      .withIndex("by_room_id", (q) => q.eq("room", args.roomId))
      .collect();
  },
});

export const getByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("merchants")
      .withIndex("by_category_id", (q) => q.eq("category", args.categoryId))
      .collect();
  },
});
