import React, { useState, useEffect } from 'react';
import { Bird, Cat, Dog } from 'lucide-react';

const loveMessages = [
  "You're my sunshine! 🌞",
  "Forever yours! 💝",
  "You make me smile! 😊",
  "My heart is yours! 💖",
  "Love you forever! 💕",
  "You're my everything! ✨",
  "Together forever! 🤗",
  "My perfect match! 🎯",
];

const AnimatedAnimals = () => {
  const [messages, setMessages] = useState([]);

  const createMessage = () => {
    const message = {
      id: Date.now(),
      text: loveMessages[Math.floor(Math.random() * loveMessages.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      animal: Math.random() > 0.66 ? 'bird' : Math.random() > 0.33 ? 'cat' : 'dog'
    };
    setMessages(prev => [...prev, message]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== message.id));
    }, 8000);
  };

  useEffect(() => {
    const interval = setInterval(createMessage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {messages.map(message => (
        <div
          key={message.id}
          className="absolute animate-message-float"
          style={{ left: `${message.x}%`, top: `${message.y}%` }}
        >
          <div className="flex items-center gap-2">
            {message.animal === 'bird' ? (
              <Bird className="w-6 h-6 text-blue-400 animate-animal-bounce" />
            ) : message.animal === 'cat' ? (
              <Cat className="w-6 h-6 text-gray-500 animate-animal-bounce" />
            ) : (
              <Dog className="w-6 h-6 text-brown-400 animate-animal-bounce" />
            )}
            <span className="text-sm font-medium text-pink-600 bg-white/80 rounded-full px-3 py-1 shadow-lg">
              {message.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedAnimals;
