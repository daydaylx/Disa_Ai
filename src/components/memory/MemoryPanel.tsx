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
    <Card className="h-full border-white/[0.02] bg-white/[0.008]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4 text-blue-400" />
            Gedächtnis
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-6 w-6 p-0">
            {isVisible ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        {threadTitle && (
          <p className="truncate text-xs text-white/60" title={threadTitle}>
            {threadTitle}
          </p>
        )}
      </CardHeader>

      {isVisible && (
        <CardContent className="space-y-3 pt-0">
          {/* Memory Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-white/80">
                Gespeicherte Punkte ({memoryPoints.length}/12)
              </h4>
              {onAddNote && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddNote(!showAddNote)}
                  className="h-6 w-6 p-0"
                  disabled={isLoading}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>

            {memoryPoints.length > 0 ? (
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {memoryPoints.map((point, index) => (
                  <div
                    key={index}
                    className="rounded border border-white/[0.012] bg-white/[0.008] p-2 text-xs"
                  >
                    <span className="text-white/90">• {point}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2 text-center text-xs italic text-white/50">
                Noch keine Gedächtnis-Punkte gespeichert
              </div>
            )}
          </div>

          {/* Add Note Form */}
          {showAddNote && onAddNote && (
            <div className="space-y-2 rounded-lg border border-white/[0.02] bg-white/[0.008] p-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-medium text-white/80">Notiz hinzufügen</h5>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddNote(false)}
                  className="h-5 w-5 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Was soll ich mir merken?"
                className="min-h-[60px] border-white/[0.02] bg-white/[0.008] text-xs"
                disabled={isAddingNote}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || isAddingNote}
                  className="h-7 flex-1 text-xs"
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
                  className="h-7 text-xs"
                >
                  Abbrechen
                </Button>
              </div>
            </div>
          )}

          {/* Status */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-white/60">
              <div className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-transparent" />
              Aktualisiere Gedächtnis...
            </div>
          )}

          {/* Stats */}
          <div className="border-t border-white/[0.02] pt-2">
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {memoryPoints.length} Punkte
              </Badge>
              {memoryPoints.length >= 10 && (
                <Badge variant="outline" className="border-orange-400 text-xs text-orange-400">
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
