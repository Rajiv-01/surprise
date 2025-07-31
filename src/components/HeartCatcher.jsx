import React, { useState, useEffect, useRef, useCallback } from "react";
import { Heart } from "lucide-react";

// Pre-define some heart types for variety
const goodHeartColors = [
  { className: "text-pink-500", fill: "currentColor", type: "normal" },
  { className: "text-red-500", fill: "currentColor", type: "normal" },
  { className: "text-rose-400", fill: "currentColor", type: "normal" },
  { className: "text-purple-400", fill: "currentColor", type: "normal" },
  {
    className: "text-yellow-400 drop-shadow-[0_0_8px_rgba(252,211,77,0.7)]",
    fill: "currentColor",
    type: "normal",
  }, // glowing heart
];

const specialHeartColors = [
  {
    className: "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)]",
    fill: "currentColor",
    type: "speed_down",
    effect: "Speed Down!",
  },
  {
    className: "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.7)]",
    fill: "currentColor",
    type: "bonus_points",
    effect: "+5 Points!",
  },
];

const blackHeartColors = [
  {
    className: "text-gray-900 drop-shadow-[0_0_8px_rgba(0,0,0,0.7)]",
    fill: "currentColor",
    type: "black",
    effect: "-1 Life!",
  }, // ominous black heart
];

const MAX_LIVES = 3; // Starting lives

const HeartCatcher = () => {
  const [hearts, setHearts] = useState([]);
  const [basketX, setBasketX] = useState(50);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameActive, setGameActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [basketCaught, setBasketCaught] = useState(false); // State for basket catch animation

  const gameAreaRef = useRef(null);
  const speedIncreaseIntervalRef = useRef(null);
  const heartGenerationIntervalRef = useRef(null);
  const animationFrameId = useRef(null);

  // Use ref for basketX to prevent excessive re-renders from mousemove
  const basketXRef = useRef(basketX);
  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  // Memoized createHeart function
  const createHeart = useCallback(() => {
    if (!gameActive) return;

    const randomVal = Math.random();
    let heartData;

    if (randomVal < 0.08) {
      heartData =
        blackHeartColors[Math.floor(Math.random() * blackHeartColors.length)];
    } else if (randomVal < 0.15) {
      heartData =
        specialHeartColors[
          Math.floor(Math.random() * specialHeartColors.length)
        ];
    } else {
      heartData =
        goodHeartColors[Math.floor(Math.random() * goodHeartColors.length)];
    }

    const newHeart = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: -10,
      rotation: Math.random() * 360,
      scale: 0.7 + Math.random() * 0.3,
      opacity: 0,
      ...heartData,
    };
    setHearts((prev) => [...prev, newHeart]);
  }, [gameActive]);

  // Game loop for heart falling and collision detection within the same loop
  useEffect(() => {
    if (!gameActive) {
      cancelAnimationFrame(animationFrameId.current);
      clearInterval(heartGenerationIntervalRef.current);
      clearInterval(speedIncreaseIntervalRef.current);
      return;
    }

    let lastTime = Date.now();
    const baseFallSpeed = 0.15; // Increased base speed significantly
    const catchZoneTop = 75; // Y percentage where hearts can be caught
    const catchZoneBottom = 95; // Y percentage where hearts can be caught

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setHearts((prevHearts) => {
        const nextHearts = [];
        const currentBasketX = basketXRef.current; // Use ref for basketX

        for (const heart of prevHearts) {
          const newY =
            heart.y + (baseFallSpeed * gameSpeed * deltaTime) / 16.67;
          const newRotation = heart.rotation + 2 * gameSpeed;
          const newOpacity = Math.min(1, heart.opacity + deltaTime / 500);

          if (heart.isCaught) {
            continue; // Skip hearts that are already caught
          }

          // Collision detection
          if (
            Math.abs(heart.x - currentBasketX) < 10 &&
            newY > catchZoneTop &&
            newY < catchZoneBottom
          ) {
            // Trigger basket catch animation
            setBasketCaught(true);
            setTimeout(() => setBasketCaught(false), 150);

            if (heart.type === "black") {
              setLives((prevLives) => prevLives - 1);
              showMessage(heart.effect, "text-red-500");
            } else if (heart.type === "speed_down") {
              setGameSpeed((prevSpeed) => Math.max(1, prevSpeed - 0.5));
              setScore((s) => s + 1);
              showMessage(heart.effect, "text-green-500");
            } else if (heart.type === "bonus_points") {
              setScore((s) => s + 5);
              showMessage(heart.effect, "text-blue-500");
            } else {
              setScore((s) => s + 1);
              createCatchEffect(heart.x, heart.y);
            }
            // Mark heart as caught and do not add to nextHearts
          } else if (newY > 100) {
            // If heart goes off screen (past 100%)
            // Only trigger loss if it's a good heart that passes
            if (heart.type !== "black") {
              setLives((prevLives) => prevLives - 1);
            }
            // Remove heart if it goes off screen and is not caught
          } else {
            // Heart is still in game, update its position and add to nextHearts
            nextHearts.push({
              ...heart,
              y: newY,
              rotation: newRotation,
              opacity: newOpacity,
            });
          }
        }
        return nextHearts;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    heartGenerationIntervalRef.current = setInterval(() => {
      createHeart();
    }, Math.max(1000 / gameSpeed, 200)); // Min 200ms interval for fast speeds

    speedIncreaseIntervalRef.current = setInterval(() => {
      setGameSpeed((prev) => prev + 0.1);
    }, 12000); // Increase speed every 12 seconds

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      clearInterval(heartGenerationIntervalRef.current);
      clearInterval(speedIncreaseIntervalRef.current);
    };
  }, [gameActive, gameSpeed, createHeart]); // Removed hearts, basketX from dependencies to avoid re-running the loop

  // Handle basket movement
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  // Using useCallback for performance and to avoid re-creating the function
  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !gameAreaRef.current) return;
      const bounds = gameAreaRef.current.getBoundingClientRect();
      // Calculate X relative to game area width
      const x = ((e.clientX - bounds.left) / bounds.width) * 100;
      setBasketX(Math.min(Math.max(x, 8), 92)); // Adjust basket boundaries
    },
    [isDragging]
  );

  // Add/remove mouseup listener globally
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Game Over logic
  useEffect(() => {
    if (lives <= 0 && gameActive) {
      setGameActive(false);
      setGameOver(true);
      setHearts([]); // Clear all active hearts on game over
    }
  }, [lives, gameActive]);

  // Display temporary messages
  const showMessage = (msg, colorClass) => {
    setMessage({ text: msg, color: colorClass });
    setTimeout(() => setMessage(""), 1500); // Message disappears after 1.5 seconds
  };

  const createCatchEffect = (x, y) => {
    const effect = document.createElement("div");
    effect.className = `absolute transform -translate-x-1/2 -translate-y-1/2 animate-catch text-2xl drop-shadow-[0_0_8px_rgba(255,105,180,0.8)]`;
    effect.style.left = `${x}%`;
    effect.style.top = `${y}%`;
    effect.innerHTML = "✨"; // Prettier catch effect
    gameAreaRef.current?.appendChild(effect);
    setTimeout(() => effect.remove(), 500);
  };

  const startGame = () => {
    setGameOver(false);
    setGameActive(true);
    setScore(0);
    setLives(MAX_LIVES);
    setGameSpeed(1);
    setHearts([]);
    setMessage("");
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300 relative">
      <h3 className="text-3xl font-extrabold text-pink-600 mb-4 text-center">
        Heart Catcher
      </h3>

      {gameOver ? (
        <div className="text-center py-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-inner">
          <h2 className="text-4xl font-bold text-purple-700 mb-4 animate-pulse">
            Game Over!
          </h2>
          <p className="text-2xl text-gray-800 mb-4">
            Final Score:{" "}
            <span className="font-extrabold text-pink-600">{score}</span> hearts
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Play Again!
          </button>
        </div>
      ) : (
        <>
          {!gameActive && !gameOver ? (
            <div className="text-center py-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-inner">
              <p className="text-xl text-gray-700 mb-6">
                Catch good hearts, avoid black ones!
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Gain special powers from green and blue hearts!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Game!
              </button>
            </div>
          ) : (
            <div
              ref={gameAreaRef}
              className="relative h-72 bg-gradient-to-b from-pink-100/50 to-purple-100/50 rounded-lg overflow-hidden border border-pink-200 shadow-inner"
              onMouseMove={handleMouseMove}
              // Add touch event listeners for mobile compatibility
              onTouchStart={handleMouseDown}
              onTouchMove={(e) => {
                // Adjust for touch events
                if (e.touches.length > 0) {
                  handleMouseMove({ clientX: e.touches[0].clientX });
                }
              }}
              onTouchEnd={handleMouseUp}
            >
              {hearts.map((heart) => (
                <Heart
                  key={heart.id}
                  className={`absolute w-7 h-7 transition-opacity duration-300 ${heart.className}`}
                  style={{
                    left: `${heart.x}%`,
                    top: `${heart.y}%`,
                    transform: `rotate(${heart.rotation}deg) scale(${heart.scale})`,
                    opacity: heart.opacity,
                  }}
                  fill={heart.fill}
                />
              ))}

              {/* Temporary Message Overlay */}
              {message && (
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-extrabold text-3xl animate-fade-out-up ${message.color}`}
                >
                  {message.text}
                </div>
              )}

              {/* Basket - ensure it's on top with higher z-index if needed, but 'bottom-0' usually puts it last */}
              <div
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 transition-all duration-100 ease-out z-10 ${
                  // Added z-10
                  isDragging ? "scale-110" : "hover:scale-105"
                } ${basketCaught ? "scale-y-90" : ""}`}
                style={{ left: `${basketX}%` }}
                onMouseDown={handleMouseDown}
              >
                <div className="relative w-24 h-24 cursor-grab active:cursor-grabbing">
                  {" "}
                  {/* Increased overall basket container size */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Main Puffy Basket Shape */}
                    <div className="w-20 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full border-4 border-blue-300 shadow-xl relative overflow-hidden">
                      {/* Inner Cloud Detail / Soft Top Edge */}
                      <div className="absolute top-0 left-0 w-full h-8 bg-white/70 rounded-full border-b-2 border-white/90 shadow-inner -translate-y-1/2"></div>
                      {/* Rainbow Arch (made of thin divs for colors) */}
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 flex justify-center items-end">
                        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-t-full opacity-70"></div>
                        <div
                          className="absolute bottom-0 w-[90%] h-1/2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-t-full opacity-70"
                          style={{ transform: "scaleX(0.9)" }}
                        ></div>
                        <div
                          className="absolute bottom-0 w-[80%] h-1/2 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 rounded-t-full opacity-70"
                          style={{ transform: "scaleX(0.8)" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {/* Confetti/Sparkle on Basket - now originating from the basket itself */}
                  <div className="absolute -top-1 -right-1 text-yellow-400 animate-sparkle text-lg">
                    ✨
                  </div>
                  <div className="absolute -bottom-1 -left-1 text-yellow-400 animate-sparkle delay-100 text-lg">
                    ✨
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 text-center grid grid-cols-3 items-center">
            <div className="text-xl font-bold text-purple-700 text-left">
              Lives:
              <span className="ml-2 flex justify-start space-x-1">
                {[...Array(MAX_LIVES)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 ${
                      i < lives ? "text-red-500" : "text-gray-300"
                    }`}
                    fill="currentColor"
                  />
                ))}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-pink-600">{score}</div>
            <p className="text-lg text-gray-600 text-right">
              Speed: {gameSpeed.toFixed(1)}x
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Drag the basket to catch hearts. Don't let good hearts pass!
          </p>
        </>
      )}

      {/* Global styles for animations */}
      <style jsx>{`
        @keyframes catch {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
        }
        @keyframes sparkle {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.2) rotate(15deg);
            opacity: 0.8;
          }
        }
        @keyframes fade-out-up {
          0% {
            opacity: 1;
            transform: translate(-50%, 0%);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -100%);
          }
        }
      `}</style>
    </div>
  );
};

export default HeartCatcher;
