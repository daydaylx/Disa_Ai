import React from "react";

type Props = {
  canStop: boolean;
  onStop: () => void;
  onRetry: () => void;
  onClear: () => void;
};

export const Toolbar: React.FC<Props> = ({ canStop, onStop, onRetry, onClear }) => {
  return (
    <div className="flex gap-2">
      <button className="btn-ghost" disabled={!canStop} onClick={onStop} title="Stream abbrechen">
        Stop
      </button>
      <button className="btn-ghost" onClick={onRetry} title="Letzte Anfrage wiederholen">
        Retry
      </button>
      <button className="btn-ghost" onClick={onClear} title="Verlauf leeren">
        Clear
      </button>
    </div>
  );
};
