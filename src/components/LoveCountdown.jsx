import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function RomanticBirthdayCountdown() {
  const targetDate = '2025-09-16T00:00:00'; // 🎂 Your GF's birthday
  const [timeLeft, setTimeLeft] = useState({});

  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return { expired: true };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed z-10  top-2 right-2 max-w-md mx-auto  p-6 text-center animate-fade-in bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl ">
      <h2 className="text-2xl font-bold text-pink-600 flex items-center justify-center gap-2">
         Tudkkuu's Birthday 💗
      </h2>
      {timeLeft.expired ? (
        <p className="mt-4 text-red-500 font-bold text-lg">🎉 It’s your Special Day! 🎂</p>
      ) : (
        <p className="mt-4 text-gray-800 text-lg font-mono">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </p>
      )}
      <p className="mt-2 text-sm text-pink-700 italic">You’re getting closer babygirllll</p>
    </div>
  );
}
