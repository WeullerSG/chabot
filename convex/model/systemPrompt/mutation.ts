import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        systemPrompt: v.string(),
    },
    handler: async (ctx, { systemPrompt }) => {
        const id = await ctx.db.insert("systemPrompts", {
            systemPrompt,
        });
        return id;
    },
});

export const update = mutation({
    args: {
        id: v.id("systemPrompts"),
        systemPrompt: v.string(),
    },
    handler: async (ctx, { id, systemPrompt }) => {
        await ctx.db.patch(id, {
            systemPrompt,
        });
    },
});
