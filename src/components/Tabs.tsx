import React from "react";

type TabValue = string;

interface TabsProps {
  children: React.ReactNode;
  value: TabValue;
  onChange: (value: TabValue) => void;
}

interface TabProps {
  value: TabValue;
  label: string;
}

interface TabsListProps {
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  value: TabValue;
  onChange: (value: TabValue) => void;
} | null>(null);

export const Tabs: React.FC<TabsProps> & {
  List: React.FC<TabsListProps>;
  Tab: React.FC<TabProps>;
} = ({ children, value, onChange }) => {
  return <TabsContext.Provider value={{ value, onChange }}>{children}</TabsContext.Provider>;
};

Tabs.List = ({ children }) => {
  return <div className="mb-4 flex gap-2">{children}</div>;
};

const TabComponent: React.FC<TabProps> = ({ value, label }) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs.Tab must be used within Tabs");
  }

  const { value: currentValue, onChange } = context;
  const isSelected = currentValue === value;

  const handleClick = () => onChange(value);

  return (
    <button
      onClick={handleClick}
      className={`rounded-lg border px-3 py-2 text-sm ${
        isSelected
          ? "border-[var(--acc1)] text-[var(--acc1)] shadow-[var(--shadow-focus-neumorphic)]"
          : "border-white/10 text-[var(--fg-dim)]"
      }`}
    >
      {label}
    </button>
  );
};

Tabs.Tab = TabComponent;
