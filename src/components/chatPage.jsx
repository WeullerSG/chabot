import { useState, useRef, useEffect } from "react";

const DEFAULT_SYSTEM =
  "Você é um assistente de e-commerce simpático. Ajude com dúvidas sobre pedidos, produtos e pagamentos. Seja direto e objetivo.";

const PRESETS = [
  {
    label: "E-commerce",
    prompt:
      "Você é um assistente de e-commerce simpático. Ajude com dúvidas sobre pedidos, produtos e pagamentos. Seja direto e objetivo.",
  },
  {
    label: "Suporte Técnico",
    prompt:
      "Você é um especialista em suporte técnico. Resolva problemas de forma clara, pedindo informações quando necessário.",
  },
  {
    label: "Atendimento Bancário",
    prompt:
      "Você é um assistente bancário. Responda dúvidas sobre conta, cartão e transferências com segurança e clareza.",
  },
  { label: "Livre", prompt: "" },
];

async function callGroq(messages, systemPrompt) {
  const formattedMessages = [
    ...(systemPrompt
      ? [{ role: "system", content: String(systemPrompt) }]
      : []),
    ...messages.map((m) => ({
      role: m.role,
      content: String(m.content || ""),
    })),
  ];

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const data = await res.json();

  console.log("STATUS:", res.status);
  console.log("RESPOSTA COMPLETA:", data);

  if (!res.ok) {
    throw new Error(data.error?.message || "Erro na API");
  }

  return data.choices?.[0]?.message?.content || "Sem resposta";
}

console.log("KEY:", import.meta.env.VITE_GROQ_API_KEY);
function Avatar({ role }) {
  if (role === "user") {
    return (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "#1A1820",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 13,
          color: "#fff",
          fontWeight: 700,
        }}
      >
        U
      </div>
    );
  }
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#FF6B00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 15,
      }}
    >
      🤖
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        flexDirection: isUser ? "row-reverse" : "row",
        marginBottom: 16,
      }}
    >
      <Avatar role={msg.role} />
      <div
        style={{
          maxWidth: "72%",
          background: isUser ? "#1A1820" : "#F7F6F2",
          color: isUser ? "#fff" : "#1A1820",
          borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          padding: "10px 14px",
          fontSize: 14,
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <Avatar role="assistant" />
      <div
        style={{
          background: "#F7F6F2",
          borderRadius: "4px 16px 16px 16px",
          padding: "12px 16px",
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#FF6B00",
              animation: "bounce 1.2s ease infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatbotAtividade() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM);
  const [activePreset, setActivePreset] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function selectPreset(i) {
    setActivePreset(i);
    setSystemPrompt(PRESETS[i].prompt);
  }

  function startChat() {
    setStarted(true);
    setMessages([]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const reply = await callGroq(newMessages, systemPrompt);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro na conexão. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function reset() {
    setMessages([]);
    setStarted(false);
    setShowConfig(false);
  }

  if (!started) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0F0D14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "sans-serif",
        }}
      >
        <style>{`
          * { box-sizing: border-box; }
          @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
          textarea:focus { outline: none; }
        `}</style>
        <div style={{ width: "100%", maxWidth: 540 }}>
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 8px",
              }}
            >
              Atividade:{" "}
              <span style={{ color: "#FF6B00" }}>Chatbot com IA</span>
            </h1>
            <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
              Configure o system prompt e converse com o agente
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                color: "#666",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Persona do agente
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => selectPreset(i)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1.5px solid",
                    borderColor: activePreset === i ? "#FF6B00" : "#2A2735",
                    background: activePreset === i ? "#1F1500" : "#17141F",
                    color: activePreset === i ? "#FF6B00" : "#888",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                color: "#666",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              System Prompt{" "}
              <span style={{ color: "#6B2DC8", fontWeight: 500, fontSize: 11 }}>
                (cérebro do agente)
              </span>
            </p>
            <textarea
              value={systemPrompt}
              onChange={(e) => {
                setSystemPrompt(e.target.value);
                setActivePreset(3);
              }}
              rows={4}
              placeholder="Defina o comportamento do agente aqui..."
              style={{
                width: "100%",
                background: "#17141F",
                border: "1.5px solid #2A2735",
                borderRadius: 10,
                color: "#E0D9FF",
                fontSize: 13,
                lineHeight: 1.6,
                padding: "12px 14px",
                resize: "vertical",
              }}
            />
          </div>

          <button
            onClick={startChat}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: "#FF6B00",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Iniciar Chat →
          </button>

          <p
            style={{
              color: "#444",
              fontSize: 11,
              textAlign: "center",
              marginTop: 16,
            }}
          >
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "#0F0D14",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        textarea:focus, input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2A2735; border-radius: 4px; }
      `}</style>

      <div
        style={{
          background: "#17141F",
          borderBottom: "1px solid #2A2735",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 22 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <p
            style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0 }}
          >
            {PRESETS[activePreset]?.label || "Agente Personalizado"}
          </p>
          <p style={{ color: "#666", fontSize: 11, margin: 0 }}>
            {messages.length} mensagem{messages.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowConfig((v) => !v)}
          style={{
            background: showConfig ? "#1F1500" : "transparent",
            border: "1px solid",
            borderColor: showConfig ? "#FF6B00" : "#2A2735",
            color: showConfig ? "#FF6B00" : "#666",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          ⚙ Prompt
        </button>
        <button
          onClick={reset}
          style={{
            background: "transparent",
            border: "1px solid #2A2735",
            color: "#666",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          ↺ Reiniciar
        </button>
      </div>

      {showConfig && (
        <div
          style={{
            background: "#17141F",
            borderBottom: "1px solid #2A2735",
            padding: "12px 20px",
          }}
        >
          <p
            style={{
              color: "#FF6B00",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            System Prompt ativo
          </p>
          <div
            style={{
              background: "#0F0D14",
              borderRadius: 8,
              padding: "10px 12px",
              color: "#888",
              fontSize: 12,
              lineHeight: 1.5,
              fontStyle: "italic",
            }}
          >
            {systemPrompt || "(sem system prompt — modo livre)"}
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <p style={{ color: "#3A3650", fontSize: 13 }}>
              Comece digitando uma mensagem...
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div
        style={{
          padding: "12px 20px 20px",
          borderTop: "1px solid #2A2735",
          background: "#0F0D14",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Digite sua mensagem... (Enter para enviar)"
            style={{
              flex: 1,
              background: "#17141F",
              border: "1.5px solid #2A2735",
              borderRadius: 12,
              color: "#E0D9FF",
              fontSize: 14,
              lineHeight: 1.5,
              padding: "10px 14px",
              resize: "none",
              maxHeight: 120,
              overflowY: "auto",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "none",
              background: input.trim() && !loading ? "#FF6B00" : "#2A2735",
              color: "#fff",
              fontSize: 18,
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
        <p
          style={{
            color: "#3A3650",
            fontSize: 11,
            textAlign: "center",
            marginTop: 8,
            marginBottom: 0,
          }}
        >
          Shift+Enter para nova linha · Enter para enviar
        </p>
      </div>
    </div>
  );
}
