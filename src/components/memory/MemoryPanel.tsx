import { Brain, ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";

interface MemoryPanelProps {
  memory: string;
  threadTitle?: string;
  isVisible: boolean;
  onToggle: () => void;
  onAddNote?: (note: string) => Promise<void>;
  onUpdateMemory?: (newMemory: string) => Promise<void>;
  isLoading?: boolean;
}

export function MemoryPanel({
  memory,
  threadTitle = "Aktueller Chat",
  isVisible,
  onToggle,
  onAddNote,
  onUpdateMemory: _onUpdateMemory,
  isLoading = false,
}: MemoryPanelProps) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const memoryPoints = memory
    ? memory
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.trim().slice(1).trim())
    : [];

  const handleAddNote = async () => {
    if (!newNote.trim() || !onAddNote) return;

    setIsAddingNote(true);
    try {
      await onAddNote(newNote.trim());
      setNewNote("");
      setShowAddNote(false);
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="text-brand h-4 w-4" />
            Gedächtnis
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
            {isVisible ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        {threadTitle && (
          <p className="text-text-1 truncate text-xs" title={threadTitle}>
            {threadTitle}
          </p>
        )}
      </CardHeader>

      {isVisible && (
        <CardContent className="space-y-3 pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-text-1 text-xs font-medium">
                Gespeicherte Punkte ({memoryPoints.length}/12)
              </h4>
              {onAddNote && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddNote(!showAddNote)}
                  className="h-6 w-6"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            {memoryPoints.length > 0 ? (
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {memoryPoints.map((point, index) => (
                  <div
                    key={index}
                    className="border-border bg-surface-2 rounded border p-2 text-xs"
                  >
                    <span className="text-text-0">• {point}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-text-1 p-2 text-center text-xs italic">
                Noch keine Gedächtnis-Punkte gespeichert
              </div>
            )}
          </div>

          {showAddNote && onAddNote && (
            <div className="border-border bg-surface-2 space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <h5 className="text-text-1 text-xs font-medium">Notiz hinzufügen</h5>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddNote(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Was soll ich mir merken?"
                className="min-h-[60px] text-xs"
                disabled={isAddingNote}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || isAddingNote}
                  className="h-8 flex-1 text-xs"
                >
                  {isAddingNote ? "Speichere..." : "Speichern"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewNote("");
                    setShowAddNote(false);
                  }}
                  disabled={isAddingNote}
                  className="h-8 text-xs"
                >
                  Abbrechen
                </Button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-text-1 flex items-center gap-2 text-xs">
              <div className="border-border h-3 w-3 animate-spin rounded-full border border-t-transparent" />
              Aktualisiere Gedächtnis...
            </div>
          )}

          <div className="border-border border-t pt-2">
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {memoryPoints.length} Punkte
              </Badge>
              {memoryPoints.length >= 10 && (
                <Badge variant="outline" className="border-warn text-warn text-xs">
                  Fast voll
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
