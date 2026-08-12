import type { SVGProps } from 'react'

export type IconName =
  | 'home'
  | 'routine'
  | 'history'
  | 'progress'
  | 'user'
  | 'plus'
  | 'play'
  | 'chevron'
  | 'back'
  | 'check'
  | 'timer'
  | 'trash'
  | 'edit'
  | 'search'
  | 'settings'
  | 'close'

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>,
  routine: <><path d="M4 7h16M4 12h16M4 17h10"/><circle cx="2.5" cy="7" r=".5"/><circle cx="2.5" cy="12" r=".5"/><circle cx="2.5" cy="17" r=".5"/></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
  progress: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  play: <path d="m9 6 9 6-9 6Z"/>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  back: <path d="m15 18-6-6 6-6"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  timer: <><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
  edit: <><path d="m4 16-1 5 5-1L19 9l-4-4Z"/><path d="m13 7 4 4"/></>,
  search: <><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5L9 6a7 7 0 0 0-1.7 1L5 6 3 9.5 5.1 11a7 7 0 0 0 0 2L3 14.5 5 18l2.3-1a7 7 0 0 0 1.7 1l.5 3h5l.5-3a7 7 0 0 0 1.7-1l2.3 1 2-3.5-2.1-1.5a7 7 0 0 0 .1-1Z"/></>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
}

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {paths[name]}
    </svg>
  )
}
