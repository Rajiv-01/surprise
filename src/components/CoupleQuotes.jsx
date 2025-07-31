import React, { useState } from 'react';
import { Quote, Heart } from 'lucide-react';

const CoupleQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const quotes = [
    // Existing quotes
    "Every love story is beautiful, but ours is my favorite. ❤️",
    "You're the missing piece to my puzzle. 🧩",
    "In your arms is where I belong. 🤗",
    
    // Sweet compliments
    "Your smile lights up my whole world. ✨",
    "You make ordinary moments extraordinary. 🌟",
    "Being with you feels like magic. 🪄",
    "You're my favorite notification. 📱",
    "My heart skips a beat every time I see you. 💓",
    "You're cuter than any puppy video on the internet. 🐶",
    
    // Romantic quotes
    "I fall in love with you more every day. 💘",
    "You're my favorite reason to lose sleep. 🌙",
    "Your love is my greatest adventure. 🗺️",
    "You're my sunshine on cloudy days. ☀️",
    "Life is better when I'm laughing with you. 😊",
    
    // Cute messages
    "You're my favorite hello and hardest goodbye. 👋",
    "I love you more than pizza... and that's saying a lot! 🍕",
    "You're my kind of weird. 🤪",
    "You + Me = Perfect. 💑",
    "You're my favorite daydream. 💭",
    
    // Deep feelings
    "Your love makes me a better person. 💫",
    "You're the first thing on my mind each morning. 🌅",
    "Every second with you is a gift. 🎁",
    "You make my heart smile. 💖",
    "I love how you make me feel like home. 🏡",
    
    // Playful compliments
    "You're prettier than a rainbow unicorn. 🦄",
    "Being with you is better than finding money in old pockets. 💰",
    "You're sweeter than a box of chocolates. 🍫",
    "You're my favorite notification. 📱",
    
    // Sweet nothings
    "Just thinking about you makes me smile. 😊",
    "You're my happy place. 🌈",
    "I love your silly dance moves. 💃",
    "You're my favorite what if that became my reality. ✨",
    "Your happiness is my happiness. 🎉",
    
    // Personal touches
    "Your hugs are my favorite place to be. 🤗",
    "I love how your eyes crinkle when you laugh. 👀",
    "Your voice is my favorite sound. 🎵",
    "You make everyday feel like a celebration. 🎊",
    "Being with you is like having my cake and eating it too. 🎂",
    
    // Future promises
    "Forever feels too short when I'm with you. ⌛",
    "You're my best today and my better tomorrow. 📅",
    "Growing old with you will be my greatest adventure. 👴👵",
    "You're my favorite plan for the future. 📍",
    "Each day with you is better than the last. 📆"
  ];

  const generateQuote = () => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      let newQuote;
      do {
        newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      } while (newQuote === currentQuote);
      
      setCurrentQuote(newQuote);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300">
      <h3 className="text-2xl font-bold text-pink-600 mb-4 flex items-center">
        <Quote className="mr-2" />
        Love Quotes
      </h3>

      <div className="min-h-[120px] flex flex-col items-center justify-center">
        {currentQuote ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 font-medium mb-2 animate-fade-in">
              {currentQuote}
            </p>
            <Heart className="mx-auto text-pink-500 animate-pulse" />
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            Click the button below to generate a romantic quote!
          </p>
        )}
      </div>

      <button
        onClick={generateQuote}
        disabled={isLoading}
        className={`w-full mt-4 py-2 px-4 rounded-full font-semibold
          ${isLoading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
          } 
          transition-all duration-300 transform hover:scale-105`}
      >
        {isLoading ? 'Generating...' : 'Generate Quote'}
      </button>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CoupleQuotes;
