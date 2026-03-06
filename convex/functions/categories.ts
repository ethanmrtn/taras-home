import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

export const createCategory = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    shape: v.string(),
    room: v.optional(v.id("rooms")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("categories", { ...args });
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getByRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_room_id", (q) => q.eq("room", args.roomId))
      .collect();
  },
});
