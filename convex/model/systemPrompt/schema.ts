import { defineTable } from "convex/server";
import { v } from "convex/values";

export const systemPromptTable = defineTable({
    systemPrompt: v.string(),
});
