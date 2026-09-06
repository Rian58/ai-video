import type React from 'react'
import { AbsoluteFill } from 'remotion'

type LayoutProps = {
  title: string
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <AbsoluteFill className="bg-[var(--color-bg-main)] text-[var(--color-text-normal)] p-12 font-mono flex flex-col">
      <div className="text-5xl font-bold text-[var(--color-accent-cyan)] mb-12 border-b-2 border-[var(--color-bg-panel)] pb-4">
        {title}
      </div>
      <div className="flex-1 flex flex-row gap-8">{children}</div>
    </AbsoluteFill>
  )
}
