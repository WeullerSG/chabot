import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function AuthPage() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (flow === "signUp" && password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    setLoading(true);
    try {
      if (flow === "signIn") {
        await signIn("password", { email, password, flow });
      } else {
        await signIn("password", { email, password, flow });
      }
    } catch (err) {
      setError(
        flow === "signIn"
          ? "Email ou senha incorretos."
          : "Não foi possível criar a conta. Tente outro email."
      );
    } finally {
      setLoading(false);
    }
  }

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
        boxSizing: "border-box",
      }}
    >
      <style>{`* { box-sizing: border-box; } input:focus { outline: none; }`}</style>

      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 8px",
            }}
          >
            {flow === "signIn" ? "Entrar" : "Criar conta"}
          </h1>
          <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
            {flow === "signIn"
              ? "Acesse o seu chatbot"
              : "Crie sua conta para começar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ color: "#666", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              style={{
                width: "100%",
                background: "#17141F",
                border: "1.5px solid #2A2735",
                borderRadius: 10,
                color: "#E0D9FF",
                fontSize: 14,
                padding: "11px 14px",
              }}
            />
          </div>

          <div>
            <label style={{ color: "#666", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                background: "#17141F",
                border: "1.5px solid #2A2735",
                borderRadius: 10,
                color: "#E0D9FF",
                fontSize: 14,
                padding: "11px 14px",
              }}
            />
          </div>

          {flow === "signUp" && (
            <p style={{ color: "#555", fontSize: 12, margin: 0 }}>
              Mínimo de 8 caracteres.
            </p>
          )}

          {error && (
            <p style={{ color: "#FF4444", fontSize: 13, margin: 0, textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              marginTop: 4,
              borderRadius: 12,
              border: "none",
              background: loading ? "#2A2735" : "#FF6B00",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Aguarde..." : flow === "signIn" ? "Entrar →" : "Criar conta →"}
          </button>
        </form>

        <p style={{ color: "#555", fontSize: 13, textAlign: "center", marginTop: 20 }}>
          {flow === "signIn" ? "Não tem conta? " : "Já tem conta? "}
          <button
            onClick={() => { setFlow(flow === "signIn" ? "signUp" : "signIn"); setError(""); }}
            style={{
              background: "none",
              border: "none",
              color: "#FF6B00",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
            }}
          >
            {flow === "signIn" ? "Criar conta" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
