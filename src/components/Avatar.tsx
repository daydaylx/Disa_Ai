import React from "react";

export default function Avatar({
  role,
  size = 28,
  label = "",
}: {
  role: "user" | "assistant";
  size?: number;
  label?: string;
}) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    fontSize: Math.max(10, Math.floor(size * 0.42)),
  };
  const text = label || (role === "user" ? "Du" : "AI");
  return (
    <div
      className={`avatar ${role === "assistant" ? "avatar--assistant" : "avatar--user"}`}
      style={style}
      aria-hidden
    >
      <span style={{ transform: "translateY(-1px)" }}>{text}</span>
    </div>
  );
}
