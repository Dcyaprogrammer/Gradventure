import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">Gradventure</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Gamified Study Abroad Preparation
          </p>
          <div className="card max-w-md mx-auto">
            <p className="mb-4">Frontend is ready for development!</p>
            <p className="text-sm text-gray-500">
              Tech Stack: React + Vite + TypeScript + TailwindCSS
            </p>
            <button
              onClick={() => setCount((count) => count + 1)}
              className="btn-primary mt-4"
            >
              Count is {count}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
