import React, { useState, useEffect, useRef, useCallback } from "react";

const MAX_LIVES = 3; // Starting lives

const KissGame = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [kisses, setKisses] = useState([]); // Changed from 'kiss' to 'kisses' array
  const [pops, setPops] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);

  const gameAreaRef = useRef(null);
  const animationFrameId = useRef(null);
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  const gameSpeedRef = useRef(gameSpeed);
  const kissGenerationIntervalRef = useRef(null); // Ref for the kiss generation interval

  // Update refs when state changes
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);
  useEffect(() => {
    gameSpeedRef.current = gameSpeed;
  }, [gameSpeed]);

  // Function to create and add a new kiss to the array
  const createNewKiss = useCallback(() => {
    if (!gameActive) return;

    const newKiss = {
      id: Date.now() + Math.random(), // Unique ID
      x: Math.random() * 80 + 10,
      y: -10,
      size: 2.5 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      opacity: 0,
      isCaught: false, // Flag to mark if a kiss has been clicked
    };
    setKisses((prev) => [...prev, newKiss]); // Add new kiss to the array
  }, [gameActive]);

  // Main game loop (animation, physics, and kiss generation/cleanup)
  useEffect(() => {
    if (!gameActive) {
      cancelAnimationFrame(animationFrameId.current);
      clearInterval(kissGenerationIntervalRef.current); // Clear interval on game end/pause
      return;
    }

    let lastTime = Date.now();
    const baseFallSpeed = 0.15; // Base speed for kisses

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setKisses((prevKisses) => {
        const nextKisses = [];
        for (const kiss of prevKisses) {
          if (kiss.isCaught) continue; // Skip already caught kisses

          const newY =
            kiss.y + (baseFallSpeed * gameSpeedRef.current * deltaTime) / 16.67;
          const newOpacity = Math.min(1, kiss.opacity + deltaTime / 500);

          if (newY > 100) {
            // Kiss went off screen
            if (livesRef.current > 0) {
              setLives((prev) => prev - 1); // Lose a life
              // Do not add this kiss to nextKisses
            } else {
              // Game Over
              setGameActive(false);
              setGameOver(true);
              return []; // Clear all kisses on game over
            }
          } else {
            // Kiss is still in game, update its position
            nextKisses.push({ ...kiss, y: newY, opacity: newOpacity });
          }
        }
        return nextKisses;
      });

      // Update pops (fade out and remove)
      setPops((prevPops) => {
        const nextPops = [];
        for (const p of prevPops) {
          const remainingTime = p.duration - (currentTime - p.startTime);
          if (remainingTime > 0) {
            nextPops.push({
              ...p,
              opacity: remainingTime / p.duration,
            });
          }
        }
        return nextPops;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start generating kisses
    kissGenerationIntervalRef.current = setInterval(() => {
      createNewKiss();
    }, Math.max(500 / gameSpeedRef.current, 150)); // Generate kisses faster with speed, min 150ms

    animationFrameId.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      clearInterval(kissGenerationIntervalRef.current);
    };
  }, [gameActive, createNewKiss]);

  // Handle click on a kiss
  const handleClickKiss = useCallback(
    (e, clickedKissId) => {
      e.stopPropagation(); // Prevent event bubbling
      if (!gameActive) return;

      setScore((prev) => prev + 1);
      setGameSpeed((prev) => prev + 0.1);

      // Create a pop effect at the clicked kiss's position
      // Find the clicked kiss to get its position for the pop effect
      const clickedKiss = kisses.find((k) => k.id === clickedKissId);
      if (clickedKiss) {
        setPops((prevPops) => [
          ...prevPops,
          {
            id: Date.now() + Math.random(),
            x: clickedKiss.x,
            y: clickedKiss.y,
            startTime: Date.now(),
            duration: 500,
            emoji: "💖",
          },
        ]);
      }

      // Mark the clicked kiss as caught so it gets removed in the next animation frame
      setKisses((prevKisses) =>
        prevKisses.map((k) =>
          k.id === clickedKissId ? { ...k, isCaught: true } : k
        )
      );
    },
    [gameActive, kisses]
  ); // Now depends on 'kisses' to find the clicked one's position

  // Function to start the game
  const startGame = () => {
    setScore(0);
    setLives(MAX_LIVES);
    setGameSpeed(1);
    setGameOver(false);
    setGameActive(true);
    setKisses([]); // Clear any old kisses
    setPops([]);
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300 relative">
      {gameOver ? (
        // Game Over Screen
        <div className="text-center py-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-inner">
          <h2 className="text-4xl font-bold text-purple-700 mb-4 animate-pulse">
            Game Over!
          </h2>
          <p className="text-2xl text-gray-800 mb-4">
            Final Score:{" "}
            <span className="font-extrabold text-pink-600">{score}</span> kisses
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Play Again!
          </button>
        </div>
      ) : (
        // Game Active / Start Screen
        <>
          {!gameActive ? (
            // Start Game Screen
            <div className="text-center py-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-inner">
              <p className="text-xl text-gray-700 mb-6">
                Catch the falling kisses to score points!
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Don't let them fall off the screen!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Game!
              </button>
            </div>
          ) : (
            // Game Play Area
            <div
              ref={gameAreaRef}
              className="relative h-72 bg-gradient-to-b from-pink-100/50 to-purple-100/50 rounded-lg overflow-hidden border border-pink-200 shadow-inner cursor-pointer"
            >
              {kisses.map(
                (
                  kiss // Map over the 'kisses' array
                ) => (
                  <button
                    key={kiss.id} // Important for React list rendering
                    onClick={(e) => handleClickKiss(e, kiss.id)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 hover:scale-110 cursor-pointer will-change-transform"
                    style={{
                      left: `${kiss.x}%`,
                      top: `${kiss.y}%`,
                      width: `${kiss.size}rem`,
                      height: `${kiss.size}rem`,
                      fontSize: `${kiss.size * 0.8}rem`,
                      transform: `translate(-50%, -50%) rotate(${kiss.rotation}deg)`,
                      opacity: kiss.opacity,
                      transition: "opacity 0.3s ease-out",
                    }}
                  >
                    <span className="filter drop-shadow-lg leading-none">
                      💋
                    </span>
                  </button>
                )
              )}

              {/* Render pop animations */}
              {pops.map((pop) => (
                <div
                  key={pop.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pop"
                  style={{
                    left: `${pop.x}%`,
                    top: `${pop.y}%`,
                    opacity: pop.opacity,
                  }}
                >
                  <span className="text-4xl">{pop.emoji}</span>
                </div>
              ))}
            </div>
          )}
          {/* Score, Lives, and Speed Display */}
          <div className="mt-4 text-center grid grid-cols-3 items-center">
            <div className="text-xl font-bold text-purple-700 text-left">
              Lives:
              <span className="ml-2 flex justify-start space-x-1">
                {[...Array(MAX_LIVES)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < lives ? "text-red-500" : "text-gray-300"
                    }`}
                  >
                    ❤️
                  </span>
                ))}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-pink-600">{score}</div>
            <p className="text-lg text-gray-600 text-right">
              Speed: {gameSpeed.toFixed(1)}x
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Click the kisses before they disappear!
          </p>
        </>
      )}

      {/* Global styles for animations */}
      <style jsx>{`
        @keyframes pop {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -100%) scale(1.5); /* Move up */
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -150%) scale(2); /* Move further up and enlarge */
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default KissGame;
