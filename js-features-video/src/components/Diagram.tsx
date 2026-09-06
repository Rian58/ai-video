import React from 'react'

type DiagramProps = {
  type:
    | 'array'
    | 'error-chain'
    | 'venn-set'
    | 'buffer'
    | 'promise-pipeline'
    | 'module'
    | 'class'
    | 'object'
    | 'iterator'
    | 'float16'
}

export const Diagram: React.FC<DiagramProps> = ({ type }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-panel)] rounded-xl shadow-2xl border border-gray-800 p-8">
      {type === 'array' && (
        <svg
          viewBox="0 0 400 100"
          className="w-full h-auto drop-shadow-lg"
          aria-labelledby="array-title"
        >
          <title id="array-title">Array Diagram</title>
          <g transform="translate(50, 20)">
            <rect
              x="0"
              y="0"
              width="80"
              height="60"
              fill="var(--color-bg-main)"
              stroke="var(--color-accent-cyan)"
              strokeWidth="4"
              rx="8"
            />
            <text
              x="40"
              y="35"
              fill="var(--color-text-normal)"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="24"
            >
              [ 0 ]
            </text>
            <rect
              x="100"
              y="0"
              width="80"
              height="60"
              fill="var(--color-bg-main)"
              stroke="var(--color-accent-cyan)"
              strokeWidth="4"
              rx="8"
            />
            <text
              x="140"
              y="35"
              fill="var(--color-text-normal)"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="24"
            >
              [ 1 ]
            </text>
            <rect
              x="200"
              y="0"
              width="80"
              height="60"
              fill="var(--color-bg-main)"
              stroke="var(--color-accent-cyan)"
              strokeWidth="4"
              rx="8"
            />
            <text
              x="240"
              y="35"
              fill="var(--color-text-normal)"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="24"
            >
              [ 2 ]
            </text>
          </g>
        </svg>
      )}

      {type === 'error-chain' && (
        <svg
          viewBox="0 0 300 200"
          className="w-full h-auto drop-shadow-lg"
          aria-labelledby="error-title"
        >
          <title id="error-title">Error Chain Diagram</title>
          <g transform="translate(50, 20)">
            <rect
              x="0"
              y="0"
              width="200"
              height="50"
              fill="var(--color-bg-main)"
              stroke="var(--color-accent-red)"
              strokeWidth="4"
              rx="8"
            />
            <text
              x="100"
              y="30"
              fill="var(--color-text-normal)"
              textAnchor="middle"
              fontSize="18"
            >
              Error: Fetch Failed
            </text>
            <path
              d="M 100 50 L 100 110"
              stroke="var(--color-text-normal)"
              strokeWidth="4"
              markerEnd="url(#arrow)"
            />
            <rect
              x="20"
              y="110"
              width="160"
              height="50"
              fill="var(--color-bg-main)"
              stroke="var(--color-accent-yellow)"
              strokeWidth="4"
              rx="8"
              strokeDasharray="5,5"
            />
            <text
              x="100"
              y="140"
              fill="var(--color-text-normal)"
              textAnchor="middle"
              fontSize="16"
            >
              Cause: NetworkError
            </text>
          </g>
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-text-normal)" />
            </marker>
          </defs>
        </svg>
      )}

      {type === 'venn-set' && (
        <svg
          viewBox="0 0 300 200"
          className="w-full h-auto drop-shadow-lg"
          aria-labelledby="venn-title"
        >
          <title id="venn-title">Venn Set Diagram</title>
          <circle
            cx="110"
            cy="100"
            r="70"
            fill="var(--color-accent-cyan)"
            fillOpacity="0.3"
            stroke="var(--color-accent-cyan)"
            strokeWidth="4"
          />
          <circle
            cx="190"
            cy="100"
            r="70"
            fill="var(--color-accent-yellow)"
            fillOpacity="0.3"
            stroke="var(--color-accent-yellow)"
            strokeWidth="4"
          />
          <text
            x="80"
            y="105"
            fill="var(--color-text-normal)"
            fontSize="24"
            textAnchor="middle"
          >
            A
          </text>
          <text
            x="220"
            y="105"
            fill="var(--color-text-normal)"
            fontSize="24"
            textAnchor="middle"
          >
            B
          </text>
          <text
            x="150"
            y="105"
            fill="var(--color-text-normal)"
            fontSize="20"
            textAnchor="middle"
          >
            A ∩ B
          </text>
        </svg>
      )}

      {type === 'buffer' && (
        <svg
          viewBox="0 0 400 150"
          className="w-full h-auto drop-shadow-lg"
          aria-labelledby="buffer-title"
        >
          <title id="buffer-title">Buffer Diagram</title>
          <rect
            x="50"
            y="50"
            width="200"
            height="50"
            fill="var(--color-accent-green)"
            fillOpacity="0.5"
            stroke="var(--color-accent-green)"
            strokeWidth="4"
          />
          <rect
            x="250"
            y="50"
            width="100"
            height="50"
            fill="transparent"
            stroke="var(--color-accent-green)"
            strokeWidth="4"
            strokeDasharray="8,8"
          />
          <text
            x="150"
            y="80"
            fill="var(--color-text-normal)"
            fontSize="18"
            textAnchor="middle"
          >
            8 Bytes (Used)
          </text>
          <text
            x="300"
            y="80"
            fill="var(--color-text-normal)"
            fontSize="16"
            textAnchor="middle"
          >
            Max: 16
          </text>
        </svg>
      )}

      {type === 'promise-pipeline' && (
        <svg
          viewBox="0 0 400 150"
          className="w-full h-auto drop-shadow-lg"
          aria-labelledby="promise-title"
        >
          <title id="promise-title">Promise Pipeline Diagram</title>
          <circle
            cx="80"
            cy="75"
            r="40"
            fill="var(--color-bg-main)"
            stroke="var(--color-accent-cyan)"
            strokeWidth="4"
          />
          <text
            x="80"
            y="80"
            fill="var(--color-text-normal)"
            fontSize="16"
            textAnchor="middle"
          >
            Pending
          </text>

          <path
            d="M 120 75 L 260 75"
            stroke="var(--color-text-normal)"
            strokeWidth="4"
            markerEnd="url(#arrow)"
          />
          <text
            x="190"
            y="65"
            fill="var(--color-accent-yellow)"
            fontSize="14"
            textAnchor="middle"
          >
            resolve()
          </text>

          <circle
            cx="300"
            cy="75"
            r="40"
            fill="var(--color-bg-main)"
            stroke="var(--color-accent-green)"
            strokeWidth="4"
          />
          <text
            x="300"
            y="80"
            fill="var(--color-text-normal)"
            fontSize="16"
            textAnchor="middle"
          >
            Fulfilled
          </text>
        </svg>
      )}

      {type === 'module' && (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-auto drop-shadow-lg"
          aria-labelledby="module-title"
        >
          <title id="module-title">Module Diagram</title>
          <rect
            x="50"
            y="30"
            width="100"
            height="140"
            fill="var(--color-bg-main)"
            stroke="var(--color-accent-cyan)"
            strokeWidth="4"
            rx="8"
          />
          <line
            x1="70"
            y1="60"
            x2="130"
            y2="60"
            stroke="var(--color-text-normal)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="80"
            x2="110"
            y2="80"
            stroke="var(--color-text-normal)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="100"
            x2="130"
            y2="100"
            stroke="var(--color-accent-yellow)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text
            x="100"
            y="145"
            fill="var(--color-accent-yellow)"
            fontSize="20"
            textAnchor="middle"
          >
            await
          </text>
        </svg>
      )}

      {type === 'class' && (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-auto drop-shadow-lg"
          aria-labelledby="class-title"
        >
          <title id="class-title">Class Diagram</title>
          <rect
            x="30"
            y="30"
            width="140"
            height="140"
            fill="var(--color-bg-main)"
            stroke="var(--color-accent-cyan)"
            strokeWidth="4"
            rx="8"
          />
          <rect
            x="30"
            y="30"
            width="140"
            height="40"
            fill="var(--color-accent-cyan)"
            fillOpacity="0.2"
          />
          <text
            x="100"
            y="55"
            fill="var(--color-text-normal)"
            fontSize="18"
            textAnchor="middle"
            fontWeight="bold"
          >
            Class User
          </text>

          <rect
            x="40"
            y="90"
            width="120"
            height="30"
            fill="var(--color-bg-panel)"
            rx="4"
          />
          <text
            x="100"
            y="110"
            fill="var(--color-accent-red)"
            fontSize="14"
            textAnchor="middle"
          >
            🔒 #password
          </text>

          <rect
            x="40"
            y="130"
            width="120"
            height="30"
            fill="var(--color-bg-panel)"
            rx="4"
          />
          <text
            x="100"
            y="150"
            fill="var(--color-accent-green)"
            fontSize="14"
            textAnchor="middle"
          >
            + check(pwd)
          </text>
        </svg>
      )}

      {type === 'object' && (
        <svg
          viewBox="0 0 250 200"
          className="w-full h-auto drop-shadow-lg"
          aria-labelledby="object-title"
        >
          <title id="object-title">Object Diagram</title>
          <rect
            x="40"
            y="40"
            width="170"
            height="120"
            fill="var(--color-bg-main)"
            stroke="var(--color-accent-yellow)"
            strokeWidth="4"
            rx="16"
          />
          <text
            x="125"
            y="80"
            fill="var(--color-text-normal)"
            fontSize="20"
            textAnchor="middle"
            fontWeight="bold"
          >{`{ Object }`}</text>
          <line
            x1="60"
            y1="100"
            x2="190"
            y2="100"
            stroke="var(--color-accent-yellow)"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <text
            x="125"
            y="130"
            fill="var(--color-accent-cyan)"
            fontSize="18"
            textAnchor="middle"
          >
            prop: 42
          </text>
        </svg>
      )}

      {type === 'iterator' && (
        <svg
          viewBox="0 0 400 150"
          className="w-full h-auto drop-shadow-lg"
          aria-labelledby="iterator-title"
        >
          <title id="iterator-title">Iterator Diagram</title>
          <path
            d="M 50 100 Q 200 150 350 100"
            fill="none"
            stroke="var(--color-bg-main)"
            strokeWidth="10"
          />
          <circle cx="100" cy="115" r="15" fill="var(--color-accent-cyan)" />
          <circle cx="200" cy="125" r="15" fill="var(--color-accent-yellow)" />
          <circle cx="300" cy="115" r="15" fill="var(--color-accent-red)" />

          <path
            d="M 170 50 L 230 50"
            stroke="var(--color-accent-green)"
            strokeWidth="4"
            markerEnd="url(#arrow)"
          />
          <text
            x="200"
            y="40"
            fill="var(--color-text-normal)"
            fontSize="16"
            textAnchor="middle"
          >
            .map(x {`=>`} x * 2)
          </text>
        </svg>
      )}

      {type === 'float16' && (
        <svg
          viewBox="0 0 400 100"
          className="w-full h-auto drop-shadow-lg"
          aria-labelledby="float-title"
        >
          <title id="float-title">Float16 Diagram</title>
          <g transform="translate(40, 30)">
            <rect
              x="0"
              y="0"
              width="320"
              height="40"
              fill="var(--color-bg-main)"
              stroke="var(--color-accent-cyan)"
              strokeWidth="4"
            />
            {(() => {
              let counter = 0
              return React.Children.toArray(
                Array.from({ length: 16 }).map(() => {
                  const idx = counter++
                  return (
                    <line
                      key={`line-${idx}`}
                      x1={(idx + 1) * 20}
                      y1="0"
                      x2={(idx + 1) * 20}
                      y2="40"
                      stroke="var(--color-accent-cyan)"
                      strokeWidth="2"
                    />
                  )
                }),
              )
            })()}
            <rect
              x="0"
              y="0"
              width="20"
              height="40"
              fill="var(--color-accent-red)"
              fillOpacity="0.5"
            />
            <rect
              x="20"
              y="0"
              width="100"
              height="40"
              fill="var(--color-accent-green)"
              fillOpacity="0.5"
            />
            <rect
              x="120"
              y="0"
              width="200"
              height="40"
              fill="var(--color-accent-yellow)"
              fillOpacity="0.5"
            />
          </g>
          <text
            x="50"
            y="90"
            fill="var(--color-text-normal)"
            fontSize="14"
            textAnchor="middle"
          >
            Sign
          </text>
          <text
            x="110"
            y="90"
            fill="var(--color-text-normal)"
            fontSize="14"
            textAnchor="middle"
          >
            Exponent (5)
          </text>
          <text
            x="260"
            y="90"
            fill="var(--color-text-normal)"
            fontSize="14"
            textAnchor="middle"
          >
            Fraction (10)
          </text>
        </svg>
      )}
    </div>
  )
}
