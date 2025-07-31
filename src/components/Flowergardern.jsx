import React, { useState } from 'react';
import { Flower2, Flower, Sparkles, Sun, Leaf, Star, Heart, CloudSun, CloudMoon, Droplet } from 'lucide-react';


export default function FlowerGarden() {
  const [flowers, setFlowers] = useState([]);
const animations = ['float', 'wiggle', 'bounce'];
  const plantFlower = (e) => {
    const newFlower = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      message: messages[Math.floor(Math.random() * messages.length)],
      variant: Math.floor(Math.random() * icons.length),
      color: colors[Math.floor(Math.random() * colors.length)],
      showMessage: true,
       animation: animations[Math.floor(Math.random() * animations.length)]
    };
    setFlowers([...flowers, newFlower]);
    setTimeout(() => {
      setFlowers((prev) =>
        prev.map((f) => (f.id === newFlower.id ? { ...f, showMessage: false } : f))
      );
    }, 3000);
  };

  const messages = [
    'I love you 💗',
    'You are my sunshine ☀️',
    'Forever yours 💍',
    'Growing together 🌱',
    'You complete me 🧩',
    'Let’s bloom forever 🌸',
    'Cuddles & kisses 🐻💋',
    'My heart is yours ❤️',
    'Blooming love 🌹',
    'Sweet like honey 🍯',
    'You + Me = 💞',
    'Dreaming of you 🌙',
    'Every day is magic ✨',
    'We grow stronger 💪🌺',
    'To the stars 🌟',
    'Rain or shine ☔️❤️',
    'Love always finds a way 🕊️'
  ];

  const icons = [
    Flower2,
    Flower,
    Sparkles,
    Sun,
    Leaf,
    Star,
    Heart,
    CloudSun,
    CloudMoon,
    Droplet
  ];

  const colors = [
    '#e91e63',
    '#f06292',
    '#ff6f61',
    '#ba68c8',
    '#ffd54f',
    '#4db6ac',
    '#81c784',
    '#64b5f6',
    '#ce93d8',
    '#ffb74d'
  ];

  return (
    <div className="garden-container" style={{ background: 'linear-gradient(135deg, #e6f9e6 0%, #f0fff0 100%)' }} onClick={plantFlower}>
      <div className="instructions">
        Click anywhere to plant a flower 🌷 with love
      </div>
      {flowers.map((flower) => {
        const Icon = icons[flower.variant];
        return (
          <div
            key={flower.id}
            className="flower group"
            style={{ top: flower.y, left: flower.x }}
          >
            <Icon size={28} className={`animate-${flower.animation} icon flower-shadow`} style={{ color: flower.color }} />
            <span
              className={`message ${flower.showMessage ? 'visible' : 'opacity-0 group-hover:opacity-100'}`}
            >
              {flower.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}
