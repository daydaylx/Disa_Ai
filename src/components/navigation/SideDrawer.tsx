import { Plus, X } from "lucide-react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  conversations: Array<{ id: string; title: string; updatedAt: string }>;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onNewChat,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Close drawer when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={onClose} />}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[var(--surface-base)] border-r border-[var(--border-subtle)] z-50 transform transition-transform duration-300 ease-in-out glass-panel ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
            <h2 className="text-lg font-semibold">Disa AI</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--surface-subtle)]"
              aria-label="Menü schließen"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="p-4 border-b border-[var(--border-subtle)]">
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-2 p-3 rounded-lg bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
            >
              <Plus size={18} />
              <span>Neuer Chat</span>
            </button>

            <nav className="mt-4 space-y-1">
              <button
                onClick={() => navigate("/roles")}
                className="w-full text-left p-3 rounded-lg hover:bg-[var(--surface-subtle)] transition-colors"
              >
                Rollen
              </button>
              <button
                onClick={() => navigate("/models")}
                className="w-full text-left p-3 rounded-lg hover:bg-[var(--surface-subtle)] transition-colors"
              >
                Modelle
              </button>
            </nav>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
              Chat-Verlauf
            </h3>
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    activeConversationId === conversation.id
                      ? "bg-[var(--brand-primary)] text-white"
                      : "hover:bg-[var(--surface-subtle)]"
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <span className="truncate">{conversation.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className="p-1 rounded hover:bg-black hover:bg-opacity-10"
                    aria-label="Konversation löschen"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {conversations.length === 0 && (
                <p className="text-[var(--text-secondary)] text-sm p-3">Keine Konversationen</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--border-subtle)]">
            <button
              onClick={() => navigate("/settings")}
              className="w-full text-left p-3 rounded-lg hover:bg-[var(--surface-subtle)] transition-colors"
            >
              Einstellungen
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
