import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

const ADMIN_EMAIL = "ethan.martin@hey.com";

// Can be called from the Convex dashboard (no auth) or from the UI (checks admin email).
export const create = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity && identity.email !== ADMIN_EMAIL) {
      throw new Error("Not authorized");
    }

    const code = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    await ctx.db.insert("invites", {
      code,
      createdBy: identity?.email ?? "dashboard",
      used: false,
      createdAt: Date.now(),
    });

    return code;
  },
});

export const validate = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    return invite !== null && !invite.used;
  },
});

export const consume = mutation({
  args: { code: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("invites")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (!invite || invite.used) {
      throw new Error("Invalid or already used invite");
    }

    await ctx.db.patch(invite._id, {
      used: true,
      usedBy: args.email,
    });
  },
});
