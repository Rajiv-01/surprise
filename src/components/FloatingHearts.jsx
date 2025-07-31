import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const createHeart = () => {
      const heartId = Date.now() + Math.random();
      const initialBottom = -50 - Math.random() * 100; // Start slightly lower or higher below screen
      const heart = {
        id: heartId,
        left: Math.random() * 90 + 5, // Hearts start between 5% and 95% width
        size: Math.random() * 25 + 30, // 30-55px for a more noticeable presence
        color: [
          "text-pink-300",
          "text-pink-400",
          "text-pink-500",
          "text-red-400",
          "text-red-500",
          "text-rose-400",
          "text-rose-500",
          "text-purple-400",
          "text-purple-500",
          "text-fuchsia-400", // Added more vibrant options
          "text-fuchsia-500",
        ][Math.floor(Math.random() * 11)], // Updated random index for more colors
        duration: Math.random() * 7 + 12, // Longer duration: 12-19 seconds for a slower, dreamier float
        delay: Math.random() * 3, // 0-3 seconds delay for staggered start
        opacity: Math.random() * 0.4 + 0.6, // 0.6-1 opacity for more visibility
        drift: (Math.random() - 0.5) * 150, // More horizontal drift: -75 to +75 pixels
        initialRotation: Math.random() * 360, // Random initial rotation
        rotationSpeed: (Math.random() - 0.5) * 10, // Small random rotation speed for subtle spin
        initialBottom: initialBottom,
      };

      setHearts((prevHearts) => [...prevHearts, heart]);

      // Remove heart after animation completes
      setTimeout(() => {
        setHearts((prevHearts) => prevHearts.filter((h) => h.id !== heartId));
      }, (heart.duration + heart.delay) * 1000);
    };

    // Create initial hearts (more of them, staggered)
    for (let i = 0; i < 8; i++) {
      // Start with more hearts
      setTimeout(createHeart, i * 600); // Shorter initial delay for quicker density
    }

    // Continue creating hearts at a slightly faster interval for more density
    const interval = setInterval(createHeart, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className={`absolute ${heart.color}`} // Removed animate-bounce as we define custom animation
          style={{
            left: `${heart.left}%`,
            bottom: `${heart.initialBottom}px`, // Use randomized initial bottom
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
            animation: `
              floatUp ${heart.duration}s ease-in-out ${heart.delay}s forwards,
              wiggle ${heart.duration * 0.4}s ease-in-out ${
              heart.delay
            }s infinite alternate,
              initialRotate ${heart.delay}s ease-out forwards,
              spin ${heart.duration}s linear infinite
            `, // Added spin animation
            transform: `translateX(${heart.drift}px) rotateZ(${heart.initialRotation}deg)`, // Initial transform
          }}
        />
      ))}

      <style jsx>{`
        @keyframes floatUp {
          0% {
            bottom: -50px;
            opacity: 0;
            transform: translateX(0px) scale(0.3) rotate(0deg); /* Start small and slightly rotated */
          }
          20% {
            opacity: ${hearts.length > 0
              ? hearts[0].opacity
              : 1}; // Use initial opacity
            transform: translateX(
                ${hearts.length > 0 ? hearts[0].drift * 0.2 : 10}px
              )
              scale(0.6);
          }
          80% {
            opacity: ${hearts.length > 0
              ? hearts[0].opacity * 0.7
              : 0.7}; // Fade slightly
            transform: translateX(
                ${hearts.length > 0 ? hearts[0].drift * 0.8 : 40}px
              )
              scale(1.1);
          }
          100% {
            bottom: 100vh;
            opacity: 0;
            transform: translateX(${hearts.length > 0 ? hearts[0].drift : 50}px)
              scale(0.8); // End slightly smaller
          }
        }

        @keyframes wiggle {
          0%,
          100% {
            transform: translateX(-5px) rotate(-2deg);
          }
          50% {
            transform: translateX(5px) rotate(2deg);
          }
        }

        @keyframes initialRotate {
          from {
            transform: rotateZ(0deg);
          }
          to {
            transform: rotateZ(var(--initial-rotation, 0deg));
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Override animate-bounce if it somehow gets applied */
        .animate-bounce {
          animation: none !important;
        }
      `}</style>
    </div>
  );
};

export default FloatingHearts;
