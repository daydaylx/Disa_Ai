import React, { useState } from "react";

import {
  type Conversation,
  type ConversationExport,
  deleteConversation,
  exportConversations,
  getAllConversations,
  getConversationStats,
  importConversations,
  searchConversations,
  updateConversationTitle,
} from "../lib/conversation-manager";
import { useToasts } from "./ui/Toast";

interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadConversation: (conversation: Conversation) => void;
  currentConversationId?: string;
}

export default function ConversationHistory({
  isOpen,
  onClose,
  onLoadConversation,
  currentConversationId,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState(getAllConversations());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const { push } = useToasts();

  const filteredConversations = searchQuery ? searchConversations(searchQuery) : conversations;

  const stats = getConversationStats();

  const refreshConversations = () => {
    setConversations(getAllConversations());
  };

  const handleDeleteConversation = (id: string) => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      if (deleteConversation(id)) {
        refreshConversations();
        push({ message: "Conversation deleted", kind: "success" });
      } else {
        push({ message: "Failed to delete conversation", kind: "error" });
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedConversations.size === 0) return;

    if (window.confirm(`Delete ${selectedConversations.size} selected conversations?`)) {
      let deletedCount = 0;
      selectedConversations.forEach((id) => {
        if (deleteConversation(id)) deletedCount++;
      });

      refreshConversations();
      setSelectedConversations(new Set());
      push({ message: `${deletedCount} conversations deleted`, kind: "success" });
    }
  };

  const handleExport = () => {
    const exportIds =
      selectedConversations.size > 0 ? Array.from(selectedConversations) : undefined;

    const exportData = exportConversations(exportIds);
    const filename = `disa-conversations-${new Date().toISOString().split("T")[0]}.json`;

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    push({
      message: `${exportData.conversations.length} conversations exported`,
      kind: "success",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string) as ConversationExport;
        const result = importConversations(importData, { mergeStrategy: "skip-duplicates" });

        if (result.success) {
          refreshConversations();
          push({
            message: `${result.importedCount} conversations imported successfully`,
            kind: "success",
          });
        } else {
          push({
            message: `Import failed: ${result.errors.join(", ")}`,
            kind: "error",
          });
        }
      } catch {
        push({
          message: "Invalid import file format",
          kind: "error",
        });
      }

      setShowImportModal(false);
    };
    reader.readAsText(file);
  };

  const handleUpdateTitle = (id: string) => {
    if (updateConversationTitle(id, newTitle)) {
      refreshConversations();
      push({ message: "Title updated", kind: "success" });
    } else {
      push({ message: "Failed to update title", kind: "error" });
    }
    setEditingTitle(null);
    setNewTitle("");
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedConversations);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedConversations(newSelection);
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor(diff / (60 * 1000));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative mx-4 max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Conversation History</h2>
            <p className="mt-1 text-sm text-slate-400">
              {stats.totalConversations} conversations • {stats.totalMessages} messages
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="border-b border-slate-700 p-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Export
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Import
              </button>
              {selectedConversations.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="rounded-lg border border-red-600 bg-red-600/10 px-3 py-2 text-sm text-red-400 hover:bg-red-600/20"
                >
                  Delete ({selectedConversations.size})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Conversation List */}
        <div className="max-h-[50vh] overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="mb-4"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-lg font-medium">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </p>
              <p className="text-sm">
                {searchQuery
                  ? "Try a different search term"
                  : "Start chatting to see your conversation history"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative p-4 transition-colors hover:bg-slate-800/50 ${
                    currentConversationId === conversation.id ? "bg-blue-900/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedConversations.has(conversation.id)}
                      onChange={() => toggleSelection(conversation.id)}
                      className="mt-1 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
                    />

                    {/* Content */}
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => onLoadConversation(conversation)}
                    >
                      {editingTitle === conversation.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdateTitle(conversation.id);
                              if (e.key === "Escape") setEditingTitle(null);
                            }}
                            className="flex-1 rounded border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-slate-200"
                            // autoFocus removed for accessibility
                          />
                          <button
                            onClick={() => handleUpdateTitle(conversation.id)}
                            className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <h3 className="font-medium text-slate-200 group-hover:text-blue-400">
                          {conversation.title}
                        </h3>
                      )}

                      <div className="mt-1 flex items-center gap-4 text-xs text-slate-400">
                        <span>{conversation.messageCount} messages</span>
                        <span>{formatRelativeTime(conversation.lastActivity)}</span>
                        {conversation.model && <span>{conversation.model}</span>}
                      </div>

                      {/* Preview of last message */}
                      {conversation.messages.length > 0 && (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                          {conversation.messages[
                            conversation.messages.length - 1
                          ]?.content?.substring(0, 100)}
                          ...
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTitle(conversation.id);
                          setNewTitle(conversation.title);
                        }}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                        title="Edit title"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        className="rounded p-1.5 text-slate-400 hover:bg-red-900/20 hover:text-red-400"
                        title="Delete conversation"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="z-60 fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowImportModal(false)} />
          <div className="relative w-96 rounded-lg border border-slate-700 bg-slate-900 p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-100">Import Conversations</h3>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="w-full rounded border border-slate-600 bg-slate-800 p-3 text-slate-200"
            />
            <p className="mt-2 text-xs text-slate-400">Select a JSON file exported from Disa AI</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
