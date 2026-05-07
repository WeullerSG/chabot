import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
    args: {
        systemPrompt: v.string(),
    },
    handler: async (ctx, { systemPrompt }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Não autenticado");
        const id = await ctx.db.insert("systemPrompts", { systemPrompt, userId });
        return id;
    },
});

export const update = mutation({
    args: {
        id: v.id("systemPrompts"),
        systemPrompt: v.string(),
    },
    handler: async (ctx, { id, systemPrompt }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Não autenticado");
        const existing = await ctx.db.get(id);
        if (existing?.userId !== userId) throw new Error("Sem permissão");
        await ctx.db.patch(id, { systemPrompt });
    },
});
