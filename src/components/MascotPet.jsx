import React, { useEffect, useState, useRef } from "react";
import petImage from "../assets/images/panda.png";
import { MessageCircle } from "lucide-react";

const phrases = [
  "Hey cutie! 💕",
  "Surprise incoming! 🎁",
  "Here's something for you 😍",
  "Ta-da! 💌",
  "I missed you! 🥺",
  "Wanna play? 🧸",
  "You're my favorite! ✨",
  "You make my heart go boom 💓",
  "Can we cuddle forever? 🐾",
  "I love surprises... like you 💝",
  "Let’s go on an adventure! 🌈",
  "Thinking of you! 💭",
  "You’re my sunshine 🌞",
  // --- New General Phrases ---
  "Feeling happy today! 😊",
  "What's up, human?",
  "Just chilling here with you! 😌",
  "Hope you're having a great day! ✨",
  "Sending you good vibes! 🌟",
  "Ready for some fun? 🎉",
  "You brighten my screen! 💖",
  "Hello there! 👋",
  "Got any snacks? 🍪",
  "Dreaming of bamboo... 🎋",
  "It's nice to see you! 😊",
  "Don't forget to smile! 😄",
  "Sometimes I just float around. 🎈",
  "Your presence makes me happy! 🥰",
];

export default function PetMascot() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  // Initial direction - will be randomized periodically
  const [direction, setDirection] = useState({ x: 1, y: 1 });
  const [typedReply, setTypedReply] = useState("");
  const [userInput, setUserInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [paused, setPaused] = useState(false);
  // New state for bounce effect
  const [isBouncing, setIsBouncing] = useState(false);

  const mascotRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const clearReplyTimeoutRef = useRef(null);

  // --- Mascot Movement with requestAnimationFrame ---
  useEffect(() => {
    let animationFrameId;

    const moveSpeed = 2; // Base speed
    const bounceSpeedMultiplier = 3; // How much faster it moves when bouncing

    const animate = () => {
      if (!paused) {
        setPosition((prev) => {
          // Determine current speed based on bounce state
          const currentMoveSpeedX = isBouncing
            ? moveSpeed * bounceSpeedMultiplier
            : moveSpeed;
          const currentMoveSpeedY = isBouncing
            ? moveSpeed * 0.75 * bounceSpeedMultiplier
            : moveSpeed * 0.75; // Slightly slower Y for a natural feel

          let nextX = prev.x + direction.x * currentMoveSpeedX;
          let nextY = prev.y + direction.y * currentMoveSpeedY;
          let newDirection = { ...direction };
          let bounced = false; // Flag to check if a bounce occurred

          // Get mascot dimensions (assuming a square mascot image of 80px)
          const mascotWidth = 80;
          const mascotHeight = 80;

          // Boundary checks
          if (nextX + mascotWidth > window.innerWidth || nextX < 0) {
            newDirection.x *= -1;
            nextX =
              nextX + mascotWidth > window.innerWidth
                ? window.innerWidth - mascotWidth
                : 0;
            bounced = true;
          }
          if (nextY + mascotHeight > window.innerHeight || nextY < 0) {
            newDirection.y *= -1;
            nextY =
              nextY + mascotHeight > window.innerHeight
                ? window.innerHeight - mascotHeight
                : 0;
            bounced = true;
          }

          if (bounced) {
            setIsBouncing(true);
            // After a short delay, turn off bouncing
            setTimeout(() => setIsBouncing(false), 200); // Bounce effect lasts for 200ms
          }

          setDirection(newDirection);
          return { x: nextX, y: nextY };
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [direction, paused, isBouncing]); // Added isBouncing to dependencies

  // --- Random Direction Change ---
  useEffect(() => {
    let randomDirectionInterval;

    const setRandomDirection = () => {
      // Generate a new random direction, ensuring it's not too static
      const newX = Math.random() * 2 - 1; // Between -1 and 1
      const newY = Math.random() * 2 - 1; // Between -1 and 1

      // Ensure the direction has some movement
      if (Math.abs(newX) < 0.2 && Math.abs(newY) < 0.2) {
        setDirection({
          x: Math.random() > 0.5 ? 1 : -1,
          y: Math.random() > 0.5 ? 1 : -1,
        });
      } else {
        setDirection({ x: newX, y: newY });
      }
    };

    // Change direction every 3-7 seconds
    const scheduleRandomDirection = () => {
      const randomTime = Math.random() * 4000 + 3000; // 3 to 7 seconds
      randomDirectionInterval = setTimeout(() => {
        if (!paused) {
          // Only change direction if not paused
          setRandomDirection();
        }
        scheduleRandomDirection(); // Schedule the next change
      }, randomTime);
    };

    scheduleRandomDirection(); // Start the first random direction timer

    return () => clearTimeout(randomDirectionInterval); // Cleanup
  }, [paused]); // Re-run if paused state changes

  // --- Spontaneous Messages ---
  useEffect(() => {
    let spontaneousMessageTimeout;

    const scheduleSpontaneousMessage = () => {
      // Random time between 15-30 seconds for a new message
      const randomTime = Math.random() * 15000 + 15000; // 15 to 30 seconds
      spontaneousMessageTimeout = setTimeout(() => {
        if (!paused && !showChat && !typedReply) {
          // Only show if not paused, chat not open, and no other message active
          const randomPhrase =
            phrases[Math.floor(Math.random() * phrases.length)];
          typeReply(randomPhrase);
        }
        scheduleSpontaneousMessage(); // Schedule the next spontaneous message
      }, randomTime);
    };

    scheduleSpontaneousMessage(); // Start the first spontaneous message timer

    return () => clearTimeout(spontaneousMessageTimeout); // Cleanup
  }, [paused, showChat, typedReply]); // Re-run if these states change

  // --- Typing Reply Logic (existing) ---
  const typeReply = (text) => {
    if (!text) return;
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    if (clearReplyTimeoutRef.current)
      clearTimeout(clearReplyTimeoutRef.current);

    let message = "";
    let index = 0;
    setTypedReply("");

    const type = () => {
      if (index < text.length) {
        message += text[index];
        setTypedReply(message);
        index++;
        typingIntervalRef.current = setTimeout(type, 50);
      } else {
        clearReplyTimeoutRef.current = setTimeout(() => {
          setTypedReply("");
        }, 4000);
      }
    };
    type();
  };

  // Cleanup typing timeouts on component unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (clearReplyTimeoutRef.current)
        clearTimeout(clearReplyTimeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    const random = phrases[Math.floor(Math.random() * phrases.length)];
    typeReply(random);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    const response = generateResponse(userInput.trim().toLowerCase());
    setUserInput("");
    setShowChat(false);
    typeReply(response);
  };

  const generateResponse = (input) => {
    if (!input) return "Say something, love! 💬";

    // --- Love & Affection ---
    if (input.includes("i love you")) return "I love you more! 💖";
    if (input.includes("miss")) return "I miss you too! 🥹";
    if (input.includes("cute") || input.includes("adorable"))
      return "You're the cutest! 😍";
    if (input.includes("thank you") || input.includes("thanks"))
      return "You're very welcome! 😊";
    if (input.includes("hello") || input.includes("hi"))
      return "Hi Tudkuu! What's new?";
    if (input.includes("how are you"))
      return "I'm doing great, thanks for asking! Just floating around. ✨";

    // --- Questions about the mascot ---
    if (input.includes("who are you") || input.includes("what are you"))
      return "I'm Pandu! Here to keep you company. 🐼";
    if (input.includes("what do you do"))
      return "I move around, say hi, and chat with you! What else should I do? 🤔";
    if (input.includes("your name"))
      return "I don't have a name, but you can call me your little panda friend! 🐾";

    // --- Mood/Feeling Responses ---
    if (input.includes("sad") || input.includes("down"))
      return "Oh no! Sending you a virtual hug. 🤗 Hope your day gets better!";
    if (input.includes("happy") || input.includes("good"))
      return "That's wonderful to hear! Keep shining! ✨";
    if (input.includes("bored"))
      return "Wanna watch me do a silly dance? (Just kidding... or am I?) 😉";

    // --- Playful & Fun Responses ---
    if (input.includes("play"))
      return "Yay! What game should we play? I'm good at staring contests! 👀";
    if (input.includes("food") || input.includes("eat"))
      return "Did someone say snacks? I'm always ready for bamboo! 🎋";
    if (input.includes("sleep") || input.includes("nap"))
      return "Nap time? Sounds cozy! Don't let the bed bugs bite! 😴";
    if (input.includes("dance")) return "Okay, here are my best wiggles! 🕺💃";
    if (input.includes("joke"))
      return "Why did the panda refuse to play cards? Because he was afraid of being shuffled! 😂";
    if (input.includes("secret"))
      return "Shhh! I might whisper one to you later... 🤫";

    // --- Generic/Fallback Responses ---
    if (input.length > 5 && input.length < 20)
      return `Interesting, you said "${input}". Tell me more!`;
    if (input.length >= 20)
      return "That's a lot to think about! My little panda brain is processing... 🧠";

    // Default fallback if no specific match
    return `Hmm... I heard: "${input}". 🐼 Can you tell me more?`;
  };

  return (
    <>
      <div
        ref={mascotRef}
        className={`fixed z-50 ${
          isBouncing ? "transition-transform duration-75 ease-out" : ""
        }`} // Apply transition only when bouncing
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          // Optionally add a slight scale transform for the bounce visual
          transform: `scale(${isBouncing ? 1.05 : 1})`,
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative flex flex-col items-center">
          <img
            src={petImage}
            alt="Cute Pet"
            onClick={handleClick}
            className="w-20 h-20 cursor-pointer hover:scale-110 transition-transform duration-300 drop-shadow-xl"
          />

          {paused && (
            <button
              onClick={() => setShowChat((prev) => !prev)}
              className="absolute -top-6 -right-4 bg-white text-pink-500 rounded-full p-1 shadow hover:bg-pink-100"
            >
              <MessageCircle size={16} />
            </button>
          )}
        </div>

        {showChat && (
          <form
            onSubmit={handleChatSubmit}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
          >
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Tell me something..."
              className="px-2 py-1 rounded border border-pink-300 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-pink-500 text-white text-sm px-3 py-1 rounded hover:bg-pink-600"
            >
              Send
            </button>
          </form>
        )}
      </div>

      {typedReply && (
        <div
          className="fixed z-50 text-sm text-center bg-white text-pink-600 p-4 rounded shadow animate-slide-in"
          style={{ top: `${position.y - 40}px`, left: `${position.x}px` }}
        >
          {typedReply}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
