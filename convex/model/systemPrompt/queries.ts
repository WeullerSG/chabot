import { query } from "../../_generated/server";

export const getSystemPrompt = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("systemPrompts").first();
    },
});
