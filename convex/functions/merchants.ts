import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    shape: v.string(),
    url: v.string(),
    notes: v.optional(v.string()),
    rooms: v.optional(v.array(v.id("rooms"))),
    categories: v.optional(v.array(v.id("categories"))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("merchants", { ...args });
  },
});

export const update = mutation({
  args: {
    id: v.id("merchants"),
    name: v.string(),
    color: v.string(),
    shape: v.string(),
    url: v.string(),
    notes: v.optional(v.string()),
    rooms: v.optional(v.array(v.id("rooms"))),
    categories: v.optional(v.array(v.id("categories"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("merchants") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("merchants").collect();
  },
});

export const getById = query({
  args: { id: v.id("merchants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("merchants").collect();
    return all.filter((m) => m.rooms?.includes(args.roomId));
  },
});

export const getByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("merchants").collect();
    return all.filter((m) => m.categories?.includes(args.categoryId));
  },
});

export const getWithoutRoom = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("merchants").collect();
    return all.filter((m) => !m.rooms || m.rooms.length === 0);
  },
});
