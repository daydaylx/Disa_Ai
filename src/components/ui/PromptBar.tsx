import * as React from "react";

export interface PromptBarProps {
  /** Placeholder text */
  placeholder?: string;
  /** Current input value */
  value?: string;
  /** Input change handler */
  onChange?: (value: string) => void;
  /** Submit handler */
  onSubmit?: (value: string) => void;
  /** Loading state */
  loading?: boolean;
  /** Optional className for additional styling */
  className?: string;
  /** Show microphone button */
  showMic?: boolean;
  /** Microphone click handler */
  onMicClick?: () => void;
}

export const PromptBar: React.FC<PromptBarProps> = ({
  placeholder = "Nachricht eingeben...",
  value = "",
  onChange,
  onSubmit,
  loading = false,
  className = "",
  showMic = true,
  onMicClick,
}) => {
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      onSubmit?.(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 glass pill ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={loading}
        className="placeholder:text-text-secondary/60 flex-1 bg-transparent px-2 text-sm outline-none"
        aria-label="Nachricht eingeben"
      />

      <div className="flex items-center gap-1">
        {showMic && (
          <button
            type="button"
            onClick={onMicClick}
            disabled={loading}
            className="hover:bg-accent-1/90 flex h-8 w-8 items-center justify-center rounded-full bg-accent-1 text-white transition-colors disabled:opacity-50"
            aria-label="Spracheingabe"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        )}

        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          className="hover:bg-accent-2/90 flex h-8 w-8 items-center justify-center rounded-full bg-accent-2 text-white transition-colors disabled:opacity-50"
          aria-label="Senden"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};
