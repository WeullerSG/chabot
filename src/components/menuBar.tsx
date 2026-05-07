import { Menu, X, Bot } from "lucide-react";
import { useState } from "react";

type PageId = "dashboard" | "system-prompt";

interface NavigationItem {
  id: PageId;
  name: string;
  href: string;
}

interface MenuBarProps {
  navigation: NavigationItem[];
  currentPage: PageId;
}


export default function MenuBar({ navigation, currentPage }: MenuBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      style={{
        background: "rgba(15, 13, 20, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(170, 59, 255, 0.15)",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-14 items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div
              style={{
                background: "linear-gradient(135deg, #aa3bff 0%, #7c3aed 100%)",
                borderRadius: 8,
                padding: "5px 6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot size={16} color="#fff" />
            </div>
            <span
              style={{
                color: "#f3f4f6",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "-0.3px",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              meu-chatbot
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.href}
                aria-current={currentPage === item.id ? "page" : undefined}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: "system-ui, sans-serif",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  ...(currentPage === item.id
                    ? {
                        background: "rgba(170, 59, 255, 0.18)",
                        color: "#c084fc",
                        boxShadow: "inset 0 0 0 1px rgba(170,59,255,0.35)",
                      }
                    : {
                        color: "#9ca3af",
                        background: "transparent",
                      }),
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== item.id) {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#e5e7eb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== item.id) {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#9ca3af";
                  }
                }}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile hamburger
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: "6px",
                color: "#9ca3af",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>*/}
        </div> 
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "8px 12px 12px",
          }}
        >
          {navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              aria-current={currentPage === item.id ? "page" : undefined}
              onClick={() => setIsOpen(false)}
              style={{
                display: "block",
                padding: "9px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "system-ui, sans-serif",
                textDecoration: "none",
                marginBottom: 4,
                ...(currentPage === item.id
                  ? {
                      background: "rgba(170, 59, 255, 0.18)",
                      color: "#c084fc",
                      boxShadow: "inset 0 0 0 1px rgba(170,59,255,0.35)",
                    }
                  : {
                      color: "#9ca3af",
                      background: "rgba(255,255,255,0.03)",
                    }),
              }}
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
