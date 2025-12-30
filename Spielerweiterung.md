Hinterlegen das bitte als Spielerweiterung.md an :
Hier ist der komplette Implementierungsplan für "Eternia Chronicles" als eigenständige Page.
Schritt 1: Die Game-Logik (Hook)
Wir brauchen einen Hook, der im Hintergrund die Nachrichten scannt und den Spielstand aktualisiert.
Erstelle: src/hooks/useGameState.ts
import { useState, useEffect } from 'react';
import { Message } from '../types/chat';

export interface GameState {
hp: number;
maxHp: number;
gold: number;
location: string;
inventory: string[];
}

const DEFAULT_STATE: GameState = {
hp: 100,
maxHp: 100,
gold: 0,
location: 'Unbekannt',
inventory: []
};

export function useGameState(messages: Message[]) {
const [gameState, setGameState] = useState<GameState>(DEFAULT_STATE);

useEffect(() => {
if (messages.length === 0) return;

    // Suche rückwärts nach dem letzten validen Game-State
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === 'assistant') {
        const match = msg.content.match(/<game_state>([\s\S]*?)<\/game_state>/);
        if (match && match[1]) {
          try {
            const parsed = JSON.parse(match[1]);
            setGameState(prev => ({ ...prev, ...parsed }));
            break; // Stop nach dem neuesten State
          } catch (e) {
            console.error("Game Parse Error", e);
          }
        }
      }
    }

}, [messages]);

return gameState;
}

export function cleanGameContent(content: string): string {
return content.replace(/<game_state>[\s\S]\*?<\/game_state>/g, '').trim();
}

Schritt 2: Das HUD (Head-Up Display)
Die Anzeige für Lebenspunkte, Gold und Ort.
Erstelle: src/components/game/GameHUD.tsx
import React from 'react';
import { GameState } from '../../hooks/useGameState';
import { Heart, Coins, MapPin, Backpack } from 'lucide-react'; // Stelle sicher, dass du lucide-react hast

export const GameHUD = ({ state }: { state: GameState }) => {
const hpPercent = Math.min(100, Math.max(0, (state.hp / state.maxHp) \* 100));

return (
<div className="bg-surface-800 text-white p-4 shadow-lg border-b border-white/10 sticky top-0 z-20">
<div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">

        {/* HP Section */}
        <div className="flex-1 min-w-[150px]">
          <div className="flex justify-between text-xs text-gray-400 mb-1 uppercase tracking-wider font-bold">
            <span className="flex items-center gap-1"><Heart size={12} className="text-red-500" /> Vitalität</span>
            <span>{state.hp} / {state.maxHp}</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden border border-white/5 relative">
             <div className="absolute inset-0 bg-red-900/50"></div>
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex gap-6 text-sm font-medium">
          <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <Coins size={16} />
            <span>{state.gold} G</span>
          </div>
          <div className="flex items-center gap-2 text-blue-300 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
            <MapPin size={16} />
            <span className="truncate max-w-[150px]">{state.location}</span>
          </div>
        </div>
      </div>
    </div>

);
};

Schritt 3: Die Rolle definieren
Füge den "Dungeon Master" zu deinen Rollen hinzu.
Bearbeite: src/data/roles.ts
Füge dieses Objekt in dein roles Array ein:
{
id: 'eternia-dm',
name: 'Eternia Erzähler',
description: 'Ein endloses Text-RPG Abenteuer.',
icon: 'swords', // Wähle ein passendes Icon
category: 'games',
systemPrompt: `Du bist der Spielleiter (DM) von "Eternia", einer düsteren Fantasy-Welt.
Führe den Spieler durch ein Abenteuer. Sei kreativ, aber fair.

WICHTIG: Du musst den Spielstatus verwalten.
Am Ende JEDER deiner Antworten, füge einen JSON-Block in <game_state> Tags hinzu.

Beispiel Format:
...Hier ist dein Erzähltext...

<game_state>
{
"hp": 90,
"maxHp": 100,
"gold": 10,
"location": "Alter Ruineneingang",
"inventory": ["Fackel", "Rostiges Messer"]
}
</game_state>

Startwerte: HP 100, Gold 0, Ort "Dorfplatz", Inventar [].
Beginne das Spiel direkt mit einer kurzen Einleitung.`
}

Schritt 4: Die neue Page (GamePage)
Hier bauen wir alles zusammen. Wir nutzen deine existierenden Chat-Komponenten, aber in einem speziellen Layout.
Erstelle: src/pages/GamePage.tsx
import React, { useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { useGameState, cleanGameContent } from '../hooks/useGameState';
import { GameHUD } from '../components/game/GameHUD';
import { UnifiedInputBar } from '../components/chat/UnifiedInputBar';
import VirtualizedMessageList from '../components/chat/VirtualizedMessageList';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GamePage() {
// Initialisiere Chat. Wichtig: Wir erzwingen hier die Game-Rolle
const {
messages,
sendMessage,
isLoading,
setRole,
startNewConversation
} = useChat();

const gameState = useGameState(messages);

// Beim Starten der Seite: Rolle setzen und ggf. neues Spiel starten wenn leer
useEffect(() => {
setRole('eternia-dm');
// Optional: Wenn keine Nachrichten da sind, starte automatisch
if (messages.length === 0) {
// startNewConversation(); // Falls nötig
}
}, [setRole, messages.length]);

// Bereinigte Nachrichten für die Anzeige (entfernt XML/JSON)
const displayMessages = messages.map(msg => ({
...msg,
content: msg.role === 'assistant' ? cleanGameContent(msg.content) : msg.content
}));

return (
<div className="flex flex-col h-screen bg-surface-900 text-text-primary">
{/_ Header mit Zurück-Button _/}
<div className="flex items-center px-4 py-2 bg-surface-800 border-b border-surface-700">
<Link to="/" className="p-2 hover:bg-surface-700 rounded-full transition-colors">
<ArrowLeft className="text-gray-400" size={20} />
</Link>
<span className="ml-3 font-bold text-lg text-gray-200">Eternia Chronicles</span>
</div>

      {/* Das Game HUD */}
      <GameHUD state={gameState} />

      {/* Chat Bereich */}
      <div className="flex-1 overflow-hidden relative bg-surface-100 dark:bg-gray-900">
        <VirtualizedMessageList
          messages={displayMessages}
          isLoading={isLoading}
        />
      </div>

      {/* Eingabebereich */}
      <div className="p-4 bg-surface-800 border-t border-surface-700">
        <div className="max-w-4xl mx-auto">
          <UnifiedInputBar
            onSendMessage={sendMessage}
            isLoading={isLoading}
            placeholder="Was möchtest du tun? (z.B. 'Ich gehe nach Norden')"
          />
        </div>
      </div>
    </div>

);
}

Schritt 5: Routing aktivieren
Füge die neue Seite zu deinem Router hinzu.
Bearbeite: src/app/router.tsx
// Imports hinzufügen
import GamePage from '../pages/GamePage';

// Innerhalb deiner Route-Definition (createBrowserRouter oder ähnlich):
{
path: "/game",
element: <GamePage />,
},

Zusammenfassung
Du hast nun eine exklusive Seite unter /game.

- Wenn der User die Seite betritt, wird die Rolle auf eternia-dm gesetzt.
- Die KI antwortet immer mit versteckten Daten.
- Der useGameState Hook extrahiert diese Daten.
- Die GameHUD zeigt sie oben an.
- Der Chat zeigt nur die Story an, keinen Code.
  Next Step: Möchtest du, dass ich dir zeige, wie du im roles.ts zusätzlich Bilder für Monster definierst, damit diese auch im Chat angezeigt werden können?
