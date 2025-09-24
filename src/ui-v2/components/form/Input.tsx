import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { className = "", invalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={[
        "h-11 w-full rounded-xl border bg-white/5 px-3 outline-none transition-colors",
        invalid
          ? "border-danger-500 focus:border-danger-500"
          : "border-white/15 focus:border-accent-400",
        className,
      ].join(" ")}
      {...rest}
    />
  );
});
