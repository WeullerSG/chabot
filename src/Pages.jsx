import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import MenuBar from "./components/menuBar";
import ChatbotAtividade from "./components/chatPage";
import { SystemPromptForm } from "./components/systemPromptForm";
import { DEFAULT_SYSTEM } from "./components/sistemPrompt";

const navigation = [
  { id: "dashboard", name: "Dashboard", href: "#dashboard" },
  { id: "system-prompt", name: "System Prompt", href: "#system-prompt" },
];

function getPageFromHash() {
  const hash = window.location.hash.replace("#", "");
  if (hash === "dashboard" || hash === "system-prompt") return hash;
  return "dashboard";
}

function usePage() {
  const [page, setPage] = useState(getPageFromHash());

  useEffect(() => {
    function handleHashChange() {
      setPage(getPageFromHash());
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return { page, navigation };
}

export default function Pages() {
  const { page, navigation } = usePage();
  const savedPrompt = useQuery(api["model/systemPrompt/queries"].getSystemPrompt);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0F0D14",
      }}
    >
      <MenuBar navigation={navigation} currentPage={page} />

      {page === "dashboard" ? (
        <ChatbotAtividade />
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div style={{ width: "100%", maxWidth: 540 }}>
            <p
              style={{
                color: "#666",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 16,
                fontFamily: "sans-serif",
              }}
            >
              Configurar System Prompt
            </p>
            <SystemPromptForm
              defaultValue={savedPrompt?.systemPrompt ?? systemPrompt}
              existingId={savedPrompt?._id}
              onSubmit={(value) => {
                setSystemPrompt(value);
                window.location.hash = "#dashboard";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
