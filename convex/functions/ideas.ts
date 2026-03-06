import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const createIdea = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    shape: v.string(),
    room: v.optional(v.id("rooms")),
    category: v.optional(v.id("categories")),
    ideaType: v.string(),
    isCompleted: v.boolean(),
    items: v.array(v.id("items")),
    merchants: v.array(v.id("merchants")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("ideas", { ...args });
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("ideas").collect();
  },
});

export const getByIsCompleted = query({
  args: { isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("ideas")
      .withIndex("by_is_completed", (q) =>
        q.eq("isCompleted", args.isCompleted),
      )
      .collect();
  },
});

export const getByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("ideas")
      .withIndex("by_category_id", (q) => q.eq("category", args.categoryId))
      .collect();
  },
});

export const getByRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("ideas")
      .withIndex("by_room_id", (q) => q.eq("room", args.roomId))
      .collect();
  },
});
