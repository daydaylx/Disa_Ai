import React from "react";

type Props = {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  htmlFor?: string;
};

export const Field: React.FC<Props> = ({ label, hint, children, htmlFor }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-white/80" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-white/60">{hint}</p> : null}
    </div>
  );
};
