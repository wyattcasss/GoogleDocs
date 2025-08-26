import { mutation, query } from "./_generated/server";
import { v } from "convex/values"
export const create = mutation({
    args: { title: v.optional(v.string()), initialContent: v.optional(v.string())},
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        if(!user){
            throw new Error("Unathorized")
        }
        const documentId= await ctx.db.insert("documents", {
            title: args.title ?? "Untitled document",
            ownerId: user.subject,
            initialContent: args.initialContent,
        })
        return documentId;
    },
})

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});