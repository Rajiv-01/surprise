import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Heart,
  Star,
  Music,
  Moon,
  Sun,
  Coffee,
  Cloud,
  Gift,
  Anchor,
  Bell,
  Diamond,
  Smile,
} from "lucide-react"; // Added more symbols

const MemoryGame = () => {
  // Themeable symbols - can be expanded!
  const allSymbols = [
    Heart,
    Star,
    Music,
    Moon,
    Sun,
    Coffee,
    Cloud,
    Gift,
    Anchor,
    Bell,
    Diamond,
    Smile,
  ];

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // Stores indices of flipped cards
  const [matched, setMatched] = useState([]); // Stores IDs of matched cards (card.id, not index)
  const [disabled, setDisabled] = useState(false); // Disables clicks during check
  const [moves, setMoves] = useState(0); // Number of pairs flipped
  const [timer, setTimer] = useState(0); // Game timer in seconds
  const [gameActive, setGameActive] = useState(false); // Game active state
  const [gameOver, setGameOver] = useState(false); // Game over state

  const timerRef = useRef(null); // Ref for timer interval

  // --- Game Initialization and Reset ---
  const initializeGame = useCallback(() => {
    // Choose a subset of symbols for the current game size (e.g., 8 unique for a 4x4 grid)
    const numPairs = 8; // For a 4x4 grid, you need 8 pairs (16 cards)
    const gameSymbols = allSymbols.slice(0, numPairs);

    const duplicatedSymbols = [...gameSymbols, ...gameSymbols];
    const shuffled = duplicatedSymbols
      .map((Icon, index) => ({
        id: `card-${index}`, // Unique ID for each card instance
        iconComponent: Icon, // Store the Lucide Icon component
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5); // Shuffle them

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setGameActive(true);
    setGameOver(false);

    // Start timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  }, []);

  // Effect to manage game state (start/reset timer, check win condition)
  useEffect(() => {
    // Initialize game on component mount
    // No, we'll initialize it with a button click to start the game
    // initializeGame();

    // Check for win condition
    if (matched.length === cards.length && cards.length > 0) {
      setGameActive(false);
      setGameOver(true);
      clearInterval(timerRef.current); // Stop timer on win
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [matched, cards.length]); // Depend on matched and cards.length for win check

  // --- Handle Card Click ---
  const handleClick = useCallback(
    (clickedCardId, clickedCardIndex) => {
      if (
        !gameActive ||
        disabled ||
        flipped.length === 2 ||
        flipped.includes(clickedCardIndex) ||
        matched.includes(clickedCardId)
      ) {
        return; // Prevent clicking if disabled, already two cards flipped, or already matched/flipped
      }

      setMoves((prev) => prev + 1); // Increment move counter

      // Flip the clicked card
      setCards((prevCards) =>
        prevCards.map((card, idx) =>
          idx === clickedCardIndex ? { ...card, isFlipped: true } : card
        )
      );

      // Add to flipped array
      const newFlipped = [...flipped, clickedCardIndex];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setDisabled(true); // Disable clicks
        checkMatch(newFlipped);
      }
    },
    [gameActive, disabled, flipped, matched]
  ); // Dependencies for useCallback

  // --- Check for Match ---
  const checkMatch = useCallback(
    (selectedCardIndexes) => {
      const [firstIndex, secondIndex] = selectedCardIndexes;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.iconComponent === secondCard.iconComponent) {
        // Match found!
        setMatched((prevMatched) => [
          ...prevMatched,
          firstCard.id,
          secondCard.id,
        ]); // Store card IDs
        setFlipped([]); // Clear flipped cards
        setDisabled(false); // Enable clicks

        // Mark cards as matched permanently
        setCards((prevCards) =>
          prevCards.map((card, idx) =>
            idx === firstIndex || idx === secondIndex
              ? { ...card, isMatched: true }
              : card
          )
        );
      } else {
        // No match - flip back after a delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card, idx) =>
              idx === firstIndex || idx === secondIndex
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlipped([]);
          setDisabled(false);
        }, 900); // Shorter delay for faster gameplay
      }
    },
    [cards]
  ); // Dependency: cards array to access iconComponent

  // Helper to format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300 relative min-w-[320px]">
      <h3 className="text-3xl font-extrabold text-pink-600 mb-4 text-center">
        Couple's Match-Up
      </h3>

      {!gameActive && !gameOver && (
        // Start Screen
        <div className="text-center py-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-inner">
          <p className="text-xl text-gray-700 mb-6">Find the matching pairs!</p>
          <button
            onClick={initializeGame}
            className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Game
          </button>
        </div>
      )}

      {gameActive && (
        <>
          <div className="flex justify-between items-center mb-4 text-gray-700 font-semibold">
            <span>
              Moves: <span className="text-pink-600 font-bold">{moves}</span>
            </span>
            <span>
              Time:{" "}
              <span className="text-pink-600 font-bold">
                {formatTime(timer)}
              </span>
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {" "}
            {/* Changed to 4 columns */}
            {cards.map((card, index) => {
              const Icon = card.iconComponent;
              // Use card.isFlipped and card.isMatched directly from the card object
              const showIcon = card.isFlipped || card.isMatched;
              const isMatched = card.isMatched;

              return (
                <button
                  key={card.id} // Use card.id for key
                  onClick={() => handleClick(card.id, index)}
                  className={`aspect-square p-2 rounded-lg transform perspective-1000 transition-all duration-300
                    ${
                      showIcon
                        ? "bg-pink-400 text-white rotate-y-0"
                        : "bg-white/50 hover:bg-white/70 rotate-y-180"
                    }
                    ${isMatched ? "opacity-70 scale-95 cursor-default" : ""}
                    ${
                      disabled && !showIcon
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }
                    relative overflow-hidden
                  `}
                  disabled={disabled || showIcon || isMatched} // Disable if disabled overall, already shown, or matched
                >
                  <div
                    className={`absolute inset-0 flex items-center justify-center backface-hidden transition-transform duration-300 ${
                      showIcon ? "rotate-y-0" : "rotate-y-180"
                    }`}
                  >
                    {showIcon && <Icon className="w-full h-full p-1" />}
                  </div>
                  <div
                    className={`absolute inset-0 flex items-center justify-center backface-hidden transition-transform duration-300 ${
                      showIcon ? "rotate-y-180" : "rotate-y-0"
                    }`}
                  >
                    {/* Card Back */}
                    <Heart
                      className="w-full h-full text-red-300 opacity-70"
                      fill="currentColor"
                    />
                  </div>

                  {isMatched && ( // Small animation for matched cards
                    <span className="absolute inset-0 flex items-center justify-center text-4xl animate-pop pointer-events-none">
                      🎉
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {gameOver && (
        // Game Over/Win Screen
        <div className="mt-4 text-center py-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-inner">
          <h2 className="text-4xl font-bold text-purple-700 mb-4 animate-pulse">
            You Won! 🎉
          </h2>
          <p className="text-2xl text-gray-800 mb-2">
            Time:{" "}
            <span className="font-extrabold text-pink-600">
              {formatTime(timer)}
            </span>
          </p>
          <p className="text-xl text-gray-800 mb-4">
            Moves: <span className="font-extrabold text-pink-600">{moves}</span>
          </p>
          <button
            onClick={initializeGame}
            className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Play Again!
          </button>
        </div>
      )}

      {/* Global CSS for flip animation */}
      <style jsx>{`
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden; /* For Safari */
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }

        @keyframes pop {
          0% {
            transform: scale(0.5);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(0.5);
            opacity: 0;
          }
        }
        .animate-pop {
          animation: pop 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MemoryGame;
