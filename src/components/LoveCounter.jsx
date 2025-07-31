import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const LoveCounter = () => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const incrementCount = () => {
    setCount(prev => prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300">
      <h3 className="text-2xl font-bold text-pink-600 mb-4">Love Counter</h3>
      <div className="text-center">
        <button
          onClick={incrementCount}
          className="relative bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-full hover:from-pink-600 hover:to-purple-600 transition-colors duration-300"
        >
          <Heart
            className={`w-12 h-12 text-white ${isAnimating ? 'scale-125' : 'scale-100'} transition-transform duration-300`}
            fill="currentColor"
          />
        </button>
        <div className="mt-4 text-3xl font-bold text-purple-700">
          {count} loves
        </div>
        <p className="mt-2 text-gray-600">Click to spread more love!</p>
      </div>
    </div>
  );
};

export default LoveCounter;
