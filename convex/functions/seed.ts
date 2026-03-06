import { mutation } from "../_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingRooms = await ctx.db.query("rooms").collect();
    if (existingRooms.length > 0) return "Already seeded";

    // Rooms
    const kitchen = await ctx.db.insert("rooms", {
      name: "Kitchen",
      color: "#B5EAD7",
      shape: "rounded-square",
    });
    const livingRoom = await ctx.db.insert("rooms", {
      name: "Living Room",
      color: "#C7CEEA",
      shape: "blob",
    });
    const bedroom = await ctx.db.insert("rooms", {
      name: "Bedroom",
      color: "#FFB7C5",
      shape: "circle",
    });
    const bathroom = await ctx.db.insert("rooms", {
      name: "Bathroom",
      color: "#FFDAC1",
      shape: "cloud",
    });

    // Categories with rooms
    const kitchenAppliances = await ctx.db.insert("categories", {
      name: "Appliances",
      color: "#7cc5b8",
      shape: "rounded-square",
      room: kitchen,
    });
    const kitchenStorage = await ctx.db.insert("categories", {
      name: "Storage",
      color: "#a8d8c8",
      shape: "circle",
      room: kitchen,
    });
    const livingFurniture = await ctx.db.insert("categories", {
      name: "Furniture",
      color: "#9bafd9",
      shape: "blob",
      room: livingRoom,
    });
    const livingDecor = await ctx.db.insert("categories", {
      name: "Decor",
      color: "#b8c4e8",
      shape: "cloud",
      room: livingRoom,
    });
    const bedroomBedding = await ctx.db.insert("categories", {
      name: "Bedding",
      color: "#f0a0b0",
      shape: "heart",
      room: bedroom,
    });

    // Roomless categories
    const cleaning = await ctx.db.insert("categories", {
      name: "Cleaning",
      color: "#E2C6E6",
      shape: "star",
    });
    const tools = await ctx.db.insert("categories", {
      name: "Tools",
      color: "#d4a76a",
      shape: "rounded-square",
    });

    // Merchants
    const ikea = await ctx.db.insert("merchants", {
      name: "IKEA",
      url: "https://ikea.com",
      color: "#0058a3",
      shape: "rounded-square",
    });
    const kmart = await ctx.db.insert("merchants", {
      name: "Kmart",
      url: "https://kmart.com.au",
      color: "#e31837",
      shape: "circle",
    });

    // Items
    await ctx.db.insert("items", {
      name: "Toaster",
      color: "#7cc5b8",
      shape: "rounded-square",
      merchant: ikea,
      price: 49.99,
      url: "https://ikea.com/toaster",
      category: kitchenAppliances,
      room: kitchen,
    });
    await ctx.db.insert("items", {
      name: "Kettle",
      color: "#a8d8c8",
      shape: "circle",
      merchant: kmart,
      price: 29.0,
      url: "https://kmart.com.au/kettle",
      category: kitchenAppliances,
      room: kitchen,
    });
    await ctx.db.insert("items", {
      name: "Couch",
      color: "#9bafd9",
      shape: "blob",
      merchant: ikea,
      price: 899.0,
      url: "https://ikea.com/couch",
      category: livingFurniture,
      room: livingRoom,
    });
    await ctx.db.insert("items", {
      name: "Cushions",
      color: "#FFB7C5",
      shape: "heart",
      merchant: kmart,
      price: 15.0,
      url: "https://kmart.com.au/cushions",
      category: livingDecor,
      room: livingRoom,
    });
    await ctx.db.insert("items", {
      name: "Duvet Set",
      color: "#f0a0b0",
      shape: "cloud",
      merchant: ikea,
      price: 79.99,
      url: "https://ikea.com/duvet",
      category: bedroomBedding,
      room: bedroom,
    });
    await ctx.db.insert("items", {
      name: "Sponges",
      color: "#E2C6E6",
      shape: "star",
      merchant: kmart,
      price: 4.5,
      url: "https://kmart.com.au/sponges",
      category: cleaning,
    });

    return "Seeded!";
  },
});
