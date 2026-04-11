import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans">
      <div className="bg-white border-4 border-black p-8 shadow-neo max-w-lg w-full text-center">
        <h1 className="text-4xl font-black mb-4 uppercase border-b-4 border-black pb-2">
          Gradventure
        </h1>
        <p className="text-xl font-bold mb-6">
          The backend and frontend are successfully integrated!
        </p>
        <button className="bg-brand-pink text-black font-bold py-3 px-6 border-2 border-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
          Start Game
        </button>
      </div>
    </div>
  );
}

export default App;