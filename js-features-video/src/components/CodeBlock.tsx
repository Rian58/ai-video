import React from 'react'
import { useCurrentFrame } from 'remotion'

type CodeBlockProps = {
  code: string
}

// Simple regex-based syntax highlighter
const highlightCode = (code: string) => {
  const tokens = code.split(
    /(\/\/.*|'.*?'|".*?"|\b(?:const|let|var|function|yield|class|try|catch|throw|new|await|async|return)\b|\b\d+(?:\.\d+)?\b|[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()|\b[A-Z][a-zA-Z0-9_$]*\b)/g,
  )

  let counter = 0
  return React.Children.toArray(
    tokens.map((token) => {
      const idx = counter++
      if (!token) return null
      if (token.startsWith('//')) {
        return (
          <span key={token + idx} className="text-[var(--color-accent-green)]">
            {token}
          </span>
        )
      }
      if (token.startsWith("'") || token.startsWith('"')) {
        return (
          <span key={token + idx} className="text-[var(--color-accent-yellow)]">
            {token}
          </span>
        )
      }
      if (
        /^(const|let|var|function|yield|class|try|catch|throw|new|await|async|return)$/.test(
          token,
        )
      ) {
        return (
          <span key={token + idx} className="text-[var(--color-accent-red)]">
            {token}
          </span>
        )
      }
      if (
        /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token) &&
        tokens[tokens.indexOf(token) + 1]?.match(/^\s*\(/) // Note: indexOf is slightly hacky here but acceptable for small snippets
      ) {
        return (
          <span key={token + idx} className="text-[var(--color-accent-cyan)]">
            {token}
          </span>
        )
      }
      if (/^[A-Z][a-zA-Z0-9_$]*$/.test(token)) {
        return (
          <span key={token + idx} className="text-[var(--color-accent-cyan)]">
            {token}
          </span>
        )
      }
      if (/^\d+(?:\.\d+)?$/.test(token)) {
        return (
          <span key={token + idx} className="text-[#79c0ff]">
            {token}
          </span>
        )
      }
      return <span key={token + idx}>{token}</span>
    }),
  )
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const frame = useCurrentFrame()

  // Show 1 character per frame (adjust speed by multiplying/dividing)
  const charsToShow = Math.max(0, Math.floor((frame - 15) * 1.5))

  const displayedCode = code.slice(0, charsToShow)

  return (
    <div className="flex-1 bg-[var(--color-bg-panel)] rounded-xl p-8 shadow-2xl border border-gray-800 overflow-hidden text-2xl leading-relaxed whitespace-pre font-mono">
      {highlightCode(displayedCode)}
      {charsToShow < code.length && (
        <span className="inline-block w-3 h-6 bg-[var(--color-text-normal)] animate-pulse ml-1 align-middle" />
      )}
    </div>
  )
}
