import React from "react";

type Props = {
  canStop: boolean;
  onStop: () => void;
  onRetry: () => void;
  onClear: () => void;
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
};

export const Toolbar: React.FC<Props> = ({
  canStop,
  onStop,
  onRetry,
  onClear,
  onExport,
  onImport,
}) => {
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => fileRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void onImport(file);
      e.target.value = ""; // Reset
    }
  };
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
      <button className="btn-ghost" onClick={onExport} title="Chat exportieren">
        Export
      </button>
      <button className="btn-ghost" onClick={handleImportClick} title="Chat importieren">
        Import
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};
