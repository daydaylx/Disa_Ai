import React from 'react'

export type IconName =
  | 'model' | 'key' | 'role' | 'copy' | 'info' | 'send' | 'stop' | 'settings' | 'sparkles'
  | 'menu' | 'moon' | 'sun' | 'shield' | 'style' | 'nsfw' | 'check' | 'arrow-down'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
  width?: number | string
  height?: number | string
}

const paths: Record<IconName, React.ReactElement> = {
  model: <path d="M4 6h16v4H4zM4 14h10v4H4z" />,
  key: <path d="M14 7a4 4 0 1 0-3.2 3.92V14h2v-2h2v-2h1.2A4 4 0 0 0 14 7z" />,
  role: <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />,
  copy: <path d="M8 8h10v12H8zM6 6h10v2H6z" />,
  info: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-6h2zm0-8h-2V7h2z" />,
  send: <path d="M2 12l20-8-6 8 6 8z" />,
  stop: <path d="M6 6h12v12H6z" />,
  settings: <path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm8 4l2-2-2-2h-2.1a7 7 0 0 0-1.1-1.9l1.5-1.5-2-2-1.5 1.5A7 7 0 0 0 12.1 2V0H10v2.1A7 7 0 0 0 8.1 3.2L6.6 1.7l-2 2 1.5 1.5A7 7 0 0 0 4 7.9H2v2h2.1a7 7 0 0 0 1.1 1.9L3.7 13.3l2 2 1.5-1.5a7 7 0 0 0 1.9 1.1V18h2v-2.1a7 7 0 0 0 1.9-1.1l1.5 1.5 2-2-1.5-1.5a7 7 0 0 0 1.1-1.9z" />,
  sparkles: <path d="M12 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />,
  menu: <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />,
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  sun: <path d="M6 12a6 6 0 1 0 6-6 6 6 0 0 0-6 6zm6-10v3m0 14v3M2 12h3m14 0h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />,
  shield: <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" />,
  style: <path d="M4 4h16v4H4zm0 6h12v4H4zm0 6h8v4H4z" />,
  nsfw: <path d="M12 2l10 6-10 6L2 8z" />,
  check: <path d="M4 12l4 4 12-12" />,
  'arrow-down': <path d="M12 5v14m0 0l-6-6m6 6l6-6" strokeWidth="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
}

export default function Icon({ name, width = 16, height = 16, className, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      className={className}
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}
