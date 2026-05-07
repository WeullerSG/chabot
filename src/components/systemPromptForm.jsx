import { useMutation } from "convex/react";
import { useState } from "react";
import { z } from "zod";
import { api } from "../../convex/_generated/api";

const systemPromptSchema = z.object({
  systemPrompt: z
    .string()
    .min(2, "O prompt deve ter ao menos 2 caracteres")
    .max(1000, "O prompt não pode ultrapassar 1000 caracteres"),
});

export function SystemPromptForm({ defaultValue = "", existingId, onSubmit }) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState(null);
  const create = useMutation(api["model/systemPrompt/mutation"].create);
  const update = useMutation(api["model/systemPrompt/mutation"].update);

  function handleSubmit(e) {
    e.preventDefault();
    const result = systemPromptSchema.safeParse({ systemPrompt: value });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    if (existingId) {
      update({ id: existingId, systemPrompt: result.data.systemPrompt });
    } else {
      create(result.data);
    }
    onSubmit?.(result.data.systemPrompt);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError(null);
        }}
        rows={4}
        placeholder="Ex: Sempre responda em português. Nunca mencione concorrentes. Limite respostas a 3 parágrafos..."
        style={{
          width: "100%",
          background: "#17141F",
          border: `1.5px solid ${error ? "#E53E3E" : "#2A2735"}`,
          borderRadius: 10,
          color: "#E0D9FF",
          fontSize: 13,
          lineHeight: 1.6,
          padding: "12px 14px",
          resize: "vertical",
          outline: "none",
        }}
      />
      {error && (
        <p style={{ color: "#E53E3E", fontSize: 12, margin: 0 }}>{error}</p>
      )}
      <p style={{ color: "#666", fontSize: 11, margin: 0, textAlign: "right" }}>
        {value.length}/1000
      </p>
      <button
        type="submit"
        style={{
          padding: "10px 0",
          borderRadius: 10,
          border: "none",
          background: "#FF6B00",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Salvar Regras
      </button>
    </form>
  );
}
