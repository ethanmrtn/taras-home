import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

export const createRoom = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    shape: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("rooms", { ...args });
  },
});

export const update = mutation({
  args: {
    id: v.id("rooms"),
    name: v.string(),
    color: v.string(),
    shape: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rooms").collect();
  },
});
