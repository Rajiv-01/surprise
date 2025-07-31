import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';
import heartbeatSound from '../assets/heartbeat.mp3';

export default function HeartbeatLoader({ isVisible = true }) {
  const [play] = useSound(heartbeatSound, { volume: 0.5 });
  const [beat, setBeat] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setBeat(true);
      play();
      setTimeout(() => setBeat(false), 300);
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, play]);

  if (!isVisible) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div
            className={`transform transition-transform duration-300 ease-in-out ${
                beat ? 'scale-125' : 'scale-100'
            }`}
            style={{ fontSize: '6rem' }} // Increased size
        >
            💗
        </div>
    </div>
);
}
