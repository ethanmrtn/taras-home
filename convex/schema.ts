import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    color: v.string(),
    name: v.string(),
    room: v.optional(v.id("rooms")),
    shape: v.string(),
  }).index("by_room_id", ["room"]),
  items: defineTable({
    imageUrl: v.optional(v.string()),
    merchant: v.id("merchants"),
    category: v.optional(v.id("categories")),
    room: v.optional(v.id("rooms")),
    name: v.string(),
    color: v.string(),
    price: v.float64(),
    shape: v.string(),
    url: v.string(),
  })
    .index("by_merchant_id", ["merchant"])
    .index("by_category_id", ["category"])
    .index("by_room_id", ["room"]),
  merchants: defineTable({
    categories: v.optional(v.array(v.id("categories"))),
    color: v.string(),
    name: v.string(),
    notes: v.optional(v.string()),
    rooms: v.optional(v.array(v.id("rooms"))),
    shape: v.string(),
    url: v.string(),
  }),
  ideas: defineTable({
    name: v.string(),
    color: v.string(),
    isCompleted: v.boolean(),
    shape: v.string(),
    ideaType: v.string(),
    items: v.array(v.id("items")),
    merchants: v.array(v.id("merchants")),
    category: v.optional(v.id("categories")),
    room: v.optional(v.id("rooms")),
  })
    .index("by_room_id", ["room"])
    .index("by_category_id", ["category"])
    .index("by_is_completed", ["isCompleted"]),
  rooms: defineTable({
    color: v.string(),
    name: v.string(),
    shape: v.string(),
  }),
  invites: defineTable({
    code: v.string(),
    createdBy: v.string(),
    used: v.boolean(),
    usedBy: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_code", ["code"]),
});
