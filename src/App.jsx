import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">Photo Gallery</h1>
        <p className="text-gray-600">
          Tailwind CSS is now set up! Edit <code className="bg-gray-200 px-2 py-1 rounded">src/App.jsx</code> to start building.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
