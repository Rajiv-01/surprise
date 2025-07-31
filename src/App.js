// Updated App.js with modal functionality for games and piano
import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  Sparkles,
  Heart,
  Image,
  Music,
  MoonStarIcon,
  X,
  SkipForward,
  SkipBack,
  Pause,
  Play,
  MapPin,
  Timer,
  Gamepad2,
  Piano,
  Target,
  HeartHandshake,
  Brain,
  NotebookPen,
  Menu,
} from "lucide-react";
import "react-calendar/dist/Calendar.css";
import FloatingHearts from "./components/FloatingHearts";
import ErrorBoundary from "./components/ErrorBoundary";
import { Fireworks } from "@fireworks-js/react";
import useSound from "use-sound";
import RomanticPiano from "./components/RomanticPiano";
import TravelMap from "./components/TravelMap";
import bgCute from "./assets/images/bg-cure.png";
import song1 from "./assets/TuHaiToh.mp3";
import song2 from "./assets/MaulaMere.mp3";
import song3 from "./assets/KinnaSohna.mp3";
import song4 from "./assets/KendeNeNaina.mp3";
import HeartbeatLoader from "./components/HeartbeatLoader";
import ShootingStars from "./components/ShootingStar";
import PetMascot from "./components/MascotPet";
import ScrapbookFlipbook from "./components/Scrapbook";
import FlowerGarden from "./components/Flowergardern";
import HeartCatcher from "./components/HeartCatcher";
import KissGame from "./components/KissGame";
import MemoryGame from "./components/MemoryGame";
import ComplimentGenerator from "./components/ComplimentGenerator";
import Gatekeeper from "./components/GateKeeper";

// Inline Birthday Countdown Component for Modal
const RomanticBirthdayCountdown = () => {
  const targetDate = "2025-09-16T00:00:00"; // 🎂 Your GF's birthday
  const [timeLeft, setTimeLeft] = useState({});

  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return { expired: true };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-pink-600 flex items-center justify-center gap-2 mb-4">
        <Heart className="w-6 h-6 animate-pulse" />
        Tudkkuu's Birthday 💗
        <Heart className="w-6 h-6 animate-pulse" />
      </h2>
      {timeLeft.expired ? (
        <div className="space-y-2">
          <p className="text-3xl font-bold text-pink-600 animate-bounce">
            🎉 It's your Special Day! 🎂
          </p>
          <p className="text-lg text-purple-600">
            Happy Birthday, Beautiful! 💖
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-pink-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-pink-600">
                {timeLeft.days || 0}
              </div>
              <div className="text-xs text-pink-500">Days</div>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">
                {timeLeft.hours || 0}
              </div>
              <div className="text-xs text-purple-500">Hours</div>
            </div>
            <div className="bg-rose-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-rose-600">
                {timeLeft.minutes || 0}
              </div>
              <div className="text-xs text-rose-500">Minutes</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-pink-600">
                {timeLeft.seconds || 0}
              </div>
              <div className="text-xs text-pink-500">Seconds</div>
            </div>
          </div>
          <p className="text-sm text-pink-700 italic animate-pulse">
            You're getting closer babygirllll 💕
          </p>
        </div>
      )}
    </div>
  );
};

const playlist = [
  { title: "Tu Hai Toh", src: song1 },
  { title: "Maula Mere", src: song2 },
  { title: "Kinna Sohna", src: song3 },
  { title: "Kendhe Ne Naina", src: song4 },
];

const App = () => {
  const [showFireworks, setShowFireworks] = useState(false);
  const [showStarGazing, setShowStargazing] = useState(false);
  const [showTravelMap, setShowTravelMap] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showSurpriseVideo, setShowSurpriseVideo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  // New modal states for games and piano
  const [showPiano, setShowPiano] = useState(false);
  const [showHeartCatcher, setShowHeartCatcher] = useState(false);
  const [showKissGame, setShowKissGame] = useState(false);
  const [showMemoryGame, setShowMemoryGame] = useState(false);
  const [showShayaris, setShowShayaris] = useState(false);

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentSong, setCurrentSong] = useState(0);
  const [play, { pause, sound }] = useSound(playlist[currentSong].src, {
    loop: true,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [specialDates, setSpecialDates] = useState(() => {
    const saved = localStorage.getItem("specialDates");
    return saved ? JSON.parse(saved) : [];
  });
  const [countdowns, setCountdowns] = useState(() => {
    const saved = localStorage.getItem("countdowns");
    return saved ? JSON.parse(saved) : [];
  });

  // Refs
  const fireworksRef = useRef(null);
  const fireworksTimeoutRef = useRef(null);
  const audioContextRef = useRef(null);
  const fireworksSoundIntervalRef = useRef(null);

  // Initialize Web Audio Context
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Create fireworks explosion sound
  const playFireworkSound = () => {
    const audioContext = initAudioContext();
    if (!audioContext) return;

    // Resume audio context if suspended (required for user interaction)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // Create explosion sound (boom)
    const createExplosion = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Low frequency boom
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        30,
        audioContext.currentTime + 0.1
      );

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    // Create sparkle/crackle sound
    const createSparkle = () => {
      const bufferSize = audioContext.sampleRate * 0.5;
      const buffer = audioContext.createBuffer(
        1,
        bufferSize,
        audioContext.sampleRate
      );
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }

      const bufferSource = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      bufferSource.buffer = buffer;
      bufferSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      filter.type = "highpass";
      filter.frequency.setValueAtTime(1000, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      bufferSource.start(audioContext.currentTime + 0.1);
    };

    // Create whistle sound (for rocket launch)
    const createWhistle = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        1200,
        audioContext.currentTime + 0.3
      );

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    // Play sounds with slight delays for realism
    setTimeout(createWhistle, 0);
    setTimeout(createExplosion, 300);
    setTimeout(createSparkle, 400);
  };

  const toggleFireworks = () => {
    if (showFireworks) {
      // Stop fireworks
      if (fireworksRef.current) {
        fireworksRef.current.stop();
      }
      setShowFireworks(false);
      if (fireworksTimeoutRef.current) {
        clearTimeout(fireworksTimeoutRef.current);
        fireworksTimeoutRef.current = null;
      }
      if (fireworksSoundIntervalRef.current) {
        clearInterval(fireworksSoundIntervalRef.current);
        fireworksSoundIntervalRef.current = null;
      }
    } else {
      // Start fireworks
      setShowFireworks(true);
      if (fireworksRef.current) {
        fireworksRef.current.start();
      }

      // Start playing fireworks sounds at intervals
      playFireworkSound(); // Play immediately
      fireworksSoundIntervalRef.current = setInterval(() => {
        playFireworkSound();
      }, 1000 + Math.random() * 2000); // Random interval between 1-3 seconds

      // Auto-stop after 15 seconds
      fireworksTimeoutRef.current = setTimeout(() => {
        if (fireworksRef.current) {
          fireworksRef.current.stop();
        }
        setShowFireworks(false);
        if (fireworksSoundIntervalRef.current) {
          clearInterval(fireworksSoundIntervalRef.current);
          fireworksSoundIntervalRef.current = null;
        }
        fireworksTimeoutRef.current = null;
      }, 15000);
    }
  };

  const toggleMusic = () => {
    if (!isPlaying) {
      play();
      setIsPlaying(true);
    } else {
      pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Reset scroll to top on every mount
  }, []);

  useEffect(() => {
    if (isPlaying && sound) {
      sound.stop(); // Stop the current sound
    }
  }, [currentSong]);

  useEffect(() => {
    const handleResize = () => {
      setPianoWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("specialDates", JSON.stringify(specialDates));
    localStorage.setItem("countdowns", JSON.stringify(countdowns));
  }, [specialDates, countdowns]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fireworksTimeoutRef.current) {
        clearTimeout(fireworksTimeoutRef.current);
      }
      if (fireworksSoundIntervalRef.current) {
        clearInterval(fireworksSoundIntervalRef.current);
      }
    };
  }, []);

  const [pianoWidth, setPianoWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const pianoContainerRef = useRef(null);

  const addSpecialDate = (date, description) => {
    setSpecialDates((prev) => [...prev, { date, description }]);
  };

  const removeSpecialDate = (date) => {
    setSpecialDates((prev) => prev.filter((d) => d.date !== date));
  };

  const addCountdown = (date, title) => {
    setCountdowns((prev) => [...prev, { date, title }]);
  };

  const removeCountdown = (date) => {
    setCountdowns((prev) => prev.filter((d) => d.date !== date));
  };
  useEffect(() => {
    if (showSurpriseVideo) {
      pause(); // Pause background music
    } else {
      if (isPlaying) {
        play(); // Resume only if music was playing
      }
    }
  }, [showSurpriseVideo]);

  // Modal Component for reusability
  const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "max-w-4xl",
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div
          className={`relative bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto animate-fade-in`}
        >
          <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-t-3xl p-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {!accessGranted && (
        <Gatekeeper onAccessGranted={() => setAccessGranted(true)} />
      )}
      {accessGranted && (
        <div
          style={{
            minHeight: "100vh",
            minWidth: "100vw",
            backgroundImage: `url(${bgCute})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            position: "relative",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div className="relative z-10">
            <ErrorBoundary>
              {!showStarGazing && <PetMascot />}
              <ShootingStars />
              <FloatingHearts />
              <HeartbeatLoader isVisible={loading} />
            </ErrorBoundary>

            {/* Fireworks with dark overlay for better contrast */}
            {showFireworks && (
              <div
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 9999 }}
              >
                {/* Dark overlay for better contrast */}
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.7))",
                  }}
                />
                <Fireworks
                  ref={fireworksRef}
                  options={{
                    autoresize: true,
                    opacity: 0.9,
                    acceleration: 1.05,
                    friction: 0.97,
                    gravity: 1,
                    particles: 150,
                    traceLength: 4,
                    traceSpeed: 5,
                    explosion: 15,
                    intensity: 40,
                    flickering: 50,
                    lineStyle: "round",
                    hue: {
                      min: 0,
                      max: 360,
                    },
                    delay: {
                      min: 20,
                      max: 40,
                    },
                    rocketsPoint: {
                      min: 20,
                      max: 80,
                    },
                    lineWidth: {
                      explosion: {
                        min: 2,
                        max: 4,
                      },
                      trace: {
                        min: 1,
                        max: 3,
                      },
                    },
                    brightness: {
                      min: 70,
                      max: 100,
                    },
                    decay: {
                      min: 0.015,
                      max: 0.03,
                    },
                    mouse: {
                      click: false,
                      move: false,
                      max: 1,
                    },
                  }}
                  style={{
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                />
              </div>
            )}

            {/* UNIFIED GLASS CONTROL PANEL */}
            <div className="fixed top-4 left-4 z-20 flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 shadow-lg">
              {/* Toggle Stargazing */}

              {/* Timer Icon */}
              <Timer
                size={26}
                onClick={() => setShowCountdown(!showCountdown)}
                className={`cursor-pointer transition-all duration-300 ${
                  showCountdown
                    ? "animate-pulse text-pink-600"
                    : "text-pink-500 hover:text-pink-600"
                }`}
              />

              {/* Separator */}
              <div className="w-px h-6 bg-pink-300/50"></div>

              {/* Music Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Song */}
                <SkipBack
                  size={22}
                  className="text-pink-500 cursor-pointer hover:text-pink-600 transition-colors"
                  onClick={() => {
                    const prevSong =
                      currentSong === 0 ? playlist.length - 1 : currentSong - 1;
                    setCurrentSong(prevSong);
                    if (isPlaying) {
                      pause();
                      setIsPlaying(false);
                      setTimeout(() => {
                        play();
                        setIsPlaying(true);
                      }, 100);
                    }
                  }}
                />

                {/* Play/Pause */}
                {isPlaying ? (
                  <Pause
                    size={26}
                    className="text-pink-500 cursor-pointer hover:text-pink-600 transition-colors"
                    onClick={toggleMusic}
                  />
                ) : (
                  <Play
                    size={26}
                    className="text-pink-500 cursor-pointer hover:text-pink-600 transition-colors"
                    onClick={toggleMusic}
                  />
                )}

                {/* Next Song */}
                <SkipForward
                  size={22}
                  className="text-pink-500 cursor-pointer hover:text-pink-600 transition-colors"
                  onClick={() => {
                    const nextSong =
                      currentSong === playlist.length - 1 ? 0 : currentSong + 1;
                    setCurrentSong(nextSong);
                    if (isPlaying) {
                      pause();
                      setIsPlaying(false);
                      setTimeout(() => {
                        play();
                        setIsPlaying(true);
                      }, 100);
                    }
                  }}
                />

                {/* Song Title Display */}
                <div className="ml-2 text-xs text-pink-600 font-medium max-w-24 truncate">
                  {playlist[currentSong].title}
                </div>
              </div>
            </div>

            {/* Desktop View */}
            <div className="fixed top-4 right-4 z-20 hidden md:flex flex-col gap-3">
              {/* Piano Button */}
              <button
                onClick={() => setShowPiano(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
                title="Romantic Piano"
              >
                <Piano size={24} className="group-hover:animate-bounce" />
              </button>

              {/* Games Panel */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2 border border-white/30 shadow-lg">
                <div className="text-xs text-pink-600 font-semibold text-center mb-2 px-2">
                  Games 💝
                </div>

                <button
                  onClick={() => setShowHeartCatcher(true)}
                  className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white p-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105 mb-2 w-full group"
                  title="Heart Catcher Game"
                >
                  <Target
                    size={20}
                    className="mx-auto group-hover:animate-spin"
                  />
                </button>

                <button
                  onClick={() => setShowKissGame(true)}
                  className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white p-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105 mb-2 w-full group"
                  title="Kiss Game"
                >
                  <HeartHandshake
                    size={20}
                    className="mx-auto group-hover:animate-pulse"
                  />
                </button>

                <button
                  onClick={() => setShowMemoryGame(true)}
                  className="bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white p-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105 mb-2 w-full group"
                  title="Memory Game"
                >
                  <Brain
                    size={20}
                    className="mx-auto group-hover:animate-bounce"
                  />
                </button>

                <button
                  onClick={() => setShowShayaris(true)}
                  className="bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white p-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105 w-full group"
                  title="Sachi si tareefein"
                >
                  <NotebookPen
                    size={20}
                    className="mx-auto group-hover:animate-bounce"
                  />
                </button>
              </div>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="fixed top-4 right-4 z-30 md:hidden">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="bg-pink-500 text-white p-3 rounded-full shadow-md"
              >
                {showMenu ? <X size={24} /> : <Menu size={24} />}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 border border-pink-200 space-y-3">
                  <div className="text-center font-bold text-pink-600 text-sm">
                    Romantic Actions
                  </div>

                  <button
                    onClick={() => {
                      setShowPiano(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg w-full"
                  >
                    <Piano size={20} />
                    <span>Piano</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowHeartCatcher(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white px-3 py-2 rounded-lg w-full"
                  >
                    <Target size={20} />
                    <span>Heart Catcher</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowKissGame(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white px-3 py-2 rounded-lg w-full"
                  >
                    <HeartHandshake size={20} />
                    <span>Kiss Game</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMemoryGame(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white px-3 py-2 rounded-lg w-full"
                  >
                    <Brain size={20} />
                    <span>Memory Game</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowShayaris(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white px-3 py-2 rounded-lg w-full"
                  >
                    <NotebookPen size={20} />
                    <span>Shayaris</span>
                  </button>
                </div>
              )}
            </div>

            {/* Birthday Countdown Modal */}
            {showCountdown && (
              <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl p-6 max-w-md w-full animate-fade-in">
                  <button
                    onClick={() => setShowCountdown(false)}
                    className="absolute top-2 right-2 text-pink-500 hover:text-pink-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <RomanticBirthdayCountdown />
                </div>
              </div>
            )}

            {/* Travel Memories Button */}
            {!showStarGazing && (
              <button
                onClick={() => setShowTravelMap(true)}
                className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-30"
              >
                <MapPin className="w-4 h-4" />
                Our Adventures
              </button>
            )}

            {/* TravelMap Modal */}
            {showTravelMap && (
              <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <div className="relative bg-white rounded-xl shadow-xl w-[90vw] h-[80vh] overflow-hidden">
                  <button
                    onClick={() => setShowTravelMap(false)}
                    className="absolute top-2 right-2 z-50 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-1"
                  >
                    <X size={20} />
                  </button>
                  <TravelMap />
                </div>
              </div>
            )}

            {showSurpriseVideo && (
              <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl w-[95vw] max-w-3xl p-6 transition-transform transform scale-100 hover:scale-[1.01]">
                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setShowSurpriseVideo(false);
                    }}
                    className="absolute top-3 right-3 z-10 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full p-2 shadow-md transition-all duration-200"
                  >
                    <X size={20} />
                  </button>

                  {/* Video Player */}
                  <div className="rounded-2xl overflow-hidden shadow-lg ring-2 ring-pink-200/40">
                    <iframe
                      allow="autoplay; fullscreen"
                      frameBorder="0"
                      width="100%"
                      height="480"
                      title="Love Message"
                      src="https://player.cloudinary.com/embed/?cloud_name=dyg2qfizv&public_id=love-message_idrn24&profile=cld-default"
                      className="w-full h-[28rem] rounded-xl"
                    />
                  </div>

                  {/* Sweet Text Below Video (optional) */}
                  <p className="mt-4 text-center text-rose-600 italic font-medium">
                    A message from my heart... just for you 💖
                  </p>
                </div>
              </div>
            )}

            {/* Piano Modal */}
            <Modal
              isOpen={showPiano}
              onClose={() => setShowPiano(false)}
              title={
                <>
                  <Piano className="w-6 h-6" />
                  Romantic Piano for My Love 🎹💕
                </>
              }
              maxWidth="max-w-6xl"
            >
              <RomanticPiano />
            </Modal>

            {/* Heart Catcher Game Modal */}
            <Modal
              isOpen={showHeartCatcher}
              onClose={() => setShowHeartCatcher(false)}
              title={
                <>
                  <Target className="w-6 h-6" />
                  Heart Catcher Game 💖
                </>
              }
              maxWidth="max-w-4xl"
            >
              <HeartCatcher />
            </Modal>

            {/* Kiss Game Modal */}
            <Modal
              isOpen={showKissGame}
              onClose={() => setShowKissGame(false)}
              title={
                <>
                  <HeartHandshake className="w-6 h-6" />
                  Kiss Game 💋
                </>
              }
              maxWidth="max-w-3xl"
            >
              <KissGame />
            </Modal>

            {/* Memory Game Modal */}
            <Modal
              isOpen={showMemoryGame}
              onClose={() => setShowMemoryGame(false)}
              title={
                <>
                  <Brain className="w-6 h-6" />
                  Memory Game 🧠💝
                </>
              }
              maxWidth="max-w-4xl"
            >
              <MemoryGame />
            </Modal>

            {/* Compliments gernerator */}
            <Modal
              isOpen={showShayaris}
              onClose={() => setShowShayaris(false)}
              title="Sachii si h yeh tareefein 💕"
            >
              <ComplimentGenerator />
            </Modal>

            {/* Hero Section - Updated for Girlfriend Day */}
            <div className="relative z-10 container mx-auto mt-12 px-2 py-8 max-w-5xl ">
              <div className="text-center mb-10 p-2 bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl">
                <section className="relative py-20 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 z-0 bg-cover opacity-10 animate-pulse" />

                  <div className="relative z-10 max-w-2xl px-6 py-12 text-center bg-white/70 rounded-3xl shadow-xl backdrop-blur-lg border border-pink-200">
                    <h1 className="text-5xl font-extrabold text-pink-600 drop-shadow mb-4 animate-fade-in">
                      Happy Girlfriend Day <br></br>Mere Tuddkee 💖
                    </h1>
                    <p className="text-lg text-rose-700 font-medium leading-relaxed mb-6 animate-fade-in delay-200">
                      Today is all about celebrating YOU - the most amazing
                      girlfriend in the world! Every pixel on this page, every
                      animation, every melody was coded with love just for you.
                      🌹✨
                    </p>
                    <p className="text-base text-gray-700 italic animate-fade-in delay-300">
                      You light up my world brighter than any constellation.
                      You're my favorite notification, my best adventure, and my
                      heart's home. This digital love letter is my way of
                      saying... 💌
                    </p>
                    <p className="text-xl text-pink-600 font-bold animate-fade-in delay-400 mt-4">
                      "I'm the luckiest person alive to call you mine!" 💕
                    </p>

                    <div className="mt-6 flex justify-center items-center gap-3 animate-fade-in delay-500">
                      <Sparkles className="text-pink-400 w-6 h-6 animate-bounce" />
                      <span className="text-pink-500 font-semibold">
                        Let's celebrate our love story together 💫
                      </span>
                      <Heart className="text-pink-400 w-6 h-6 animate-bounce" />
                    </div>
                  </div>
                </section>
                <div className="flex gap-4 justify-center items-center flex-wrap">
                  <button
                    onClick={() => setShowSurpriseVideo(true)}
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:scale-105 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-200 animate-pulse flex items-center justify-center"
                  >
                    <Star className="inline w-6 h-6 mr-2 animate-spin-slow" />
                    Surprise My Queen!
                  </button>

                  {/* Enhanced Fireworks Button with 15-second timer indication */}
                  <button
                    onClick={toggleFireworks}
                    className={`bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:scale-105 hover:from-purple-700 hover:via-pink-700 hover:to-red-600 transition-all duration-200 flex items-center justify-center ${
                      showFireworks
                        ? "animate-pulse bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500"
                        : ""
                    }`}
                  >
                    <Sparkles className="inline w-6 h-6 mr-2 animate-bounce" />
                    {showFireworks ? "Celebrating! 🎆" : "Celebrate Us! 🎆"}
                  </button>
                </div>
              </div>
            </div>

            {/* Scrapbook and Flower Garden - Keep these in main view */}
            <ScrapbookFlipbook />
            <FlowerGarden />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
