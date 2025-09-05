import React from "react";

export type IconName =
  | "send"
  | "stop"
  | "settings"
  | "info"
  | "copy"
  | "check"
  | "close"
  | "menu"
  | "error"
  | "success"
  | "warning";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  title?: string;
}

const paths: Record<IconName, JSX.Element> = {
  send:     (<path d="M3 11l18-8-8 18-2-7-8-3z" />),
  stop:     (<rect x="5" y="5" width="14" height="14" rx="2" />),
  settings:(<path d="M12 8a4 4 0 100 8 4 4 0 000-8zm8.94 4a7.94 7.94 0 01-.16 1.62l2.11 1.65-2 3.46-2.49-1a8.07 8.07 0 01-2.8 1.62l-.38 2.64H9.78l-.38-2.64a8.07 8.07 0 01-2.8-1.62l-2.49 1-2-3.46 2.11-1.65A7.94 7.94 0 013 12c0-.55.06-1.09.16-1.62L1.05 8.73l2-3.46 2.49 1a8.07 8.07 0 012.8-1.62L8.72 2h6.56l.38 2.64a8.07 8.07 0 012.8 1.62l2.49-1 2 3.46-2.11 1.65c.1.53.16 1.07.16 1.62z" />),
  info:     (<path d="M12 2a10 10 0 110 20 10 10 0 010-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />),
  copy:     (<path d="M16 1H4a2 2 0 00-2 2v12h2V3h12V1zm3 4H8a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 14H8V7h11v12z" />),
  check:    (<path d="M20 6L9 17l-5-5" />),
  close:    (<path d="M6 6l12 12M6 18L18 6" />),
  menu:     (<path d="M3 6h18M3 12h18M3 18h18" />),
  error:    (<path d="M12 2a10 10 0 110 20 10 10 0 010-20zM12 6v6m0 4h.01" />),
  success:  (<path d="M12 2a10 10 0 110 20 10 10 0 010-20zm-2 10l2 2 4-4" />),
  warning:  (<path d="M12 2l10 18H2L12 2zm0 6v4m0 4h.01" />),
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, title, ...rest }) => {
  return (
    <svg
      width={size}
      height={size}
      role="img"
      aria-label={title || name}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
};
