import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UseAnimations from "react-useanimations";
import close from "react-useanimations/lib/close";
import bot from "react-useanimations/lib/infinity";
import plus from "react-useanimations/lib/plus";
import settings from "react-useanimations/lib/settings";
import users from "react-useanimations/lib/users";

import Ripple from "../ui/Ripple";

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
        className={`fixed top-0 left-0 h-full w-80 bg-[var(--surface-base)]/80 backdrop-blur-lg border-r border-[var(--border-subtle)] z-50 transform transition-transform duration-300 ease-in-out glass-panel ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
            <h2 className="text-headline">Disa AI</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--surface-subtle)] relative"
              aria-label="Menü schließen"
            >
              <UseAnimations animation={close} size={20} />
              <Ripple />
            </button>
          </div>

          {/* Navigation */}
          <div className="p-4 border-b border-[var(--border-subtle)]">
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-2 p-3 rounded-lg bg-accent text-white hover:bg-accent-dark transition-colors text-body relative"
            >
              <UseAnimations animation={plus} size={18} />
              <span>Neuer Chat</span>
              <Ripple />
            </button>

            <nav className="mt-4 space-y-1">
              <button
                onClick={() => navigate("/roles")}
                className="w-full text-left p-3 rounded-lg hover:bg-[var(--surface-subtle)] transition-colors text-body relative"
              >
                <UseAnimations animation={users} size={20} />
                Rollen
                <Ripple />
              </button>
              <button
                onClick={() => navigate("/models")}
                className="w-full text-left p-3 rounded-lg hover:bg-[var(--surface-subtle)] transition-colors text-body relative"
              >
                <UseAnimations animation={bot} size={20} />
                Modelle
                <Ripple />
              </button>
            </nav>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-subheadline text-[var(--text-secondary)] mb-2">Chat-Verlauf</h3>
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-body relative ${
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
                    className="p-1 rounded hover:bg-black hover:bg-opacity-10 relative"
                    aria-label="Konversation löschen"
                  >
                    <UseAnimations animation={close} size={16} />
                    <Ripple />
                  </button>
                  <Ripple />
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
              className="w-full text-left p-3 rounded-lg hover:bg-[var(--surface-subtle)] transition-colors text-body relative"
            >
              <UseAnimations animation={settings} size={20} />
              Einstellungen
              <Ripple />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
