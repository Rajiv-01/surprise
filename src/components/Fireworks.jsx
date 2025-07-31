// FireworksComponent.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Fireworks } from 'fireworks-js';

const FireworksComponent = ({
  autoStart = false,
  options = {},
  className = '',
  style = {},
  children,
  onStart,
  onStop,
}) => {
  const containerRef = useRef(null);
  const fireworksRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);

  // Default fireworks options
  const defaultOptions = {
    autoresize: true,
    opacity: 0.5,
    acceleration: 1.05,
    friction: 0.97,
    gravity: 1.5,
    particles: 50,
    traceLength: 3,
    traceSpeed: 10,
    explosion: 5,
    intensity: 30,
    flickering: 50,
    lineStyle: 'round',
    hue: {
      min: 0,
      max: 360
    },
    delay: {
      min: 30,
      max: 60
    },
    rocketsPoint: {
      min: 50,
      max: 50
    },
    lineWidth: {
      explosion: {
        min: 1,
        max: 3
      },
      trace: {
        min: 1,
        max: 2
      }
    },
    brightness: {
      min: 50,
      max: 80
    },
    decay: {
      min: 0.015,
      max: 0.03
    },
    mouse: {
      click: false,
      move: false,
      max: 1
    }
  };

  // Merge default options with user options
  const mergedOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    if (containerRef.current) {
      // Initialize fireworks
      fireworksRef.current = new Fireworks(containerRef.current, mergedOptions);

      // Auto start if specified
      if (autoStart) {
        fireworksRef.current.start();
        setIsRunning(true);
        onStart?.();
      }
    }

    // Cleanup on unmount
    return () => {
      if (fireworksRef.current) {
        fireworksRef.current.stop();
        fireworksRef.current = null;
      }
    };
  }, []);

  // Update options when they change
  useEffect(() => {
    if (fireworksRef.current) {
      fireworksRef.current.updateOptions(mergedOptions);
    }
  }, [options]);

  const startFireworks = () => {
    if (fireworksRef.current && !isRunning) {
      fireworksRef.current.start();
      setIsRunning(true);
      onStart?.();
    }
  };

  const stopFireworks = () => {
    if (fireworksRef.current && isRunning) {
      fireworksRef.current.stop();
      setIsRunning(false);
      onStop?.();
    }
  };

  const toggleFireworks = () => {
    if (isRunning) {
      stopFireworks();
    } else {
      startFireworks();
    }
  };

  const launchFireworks = (count = 1) => {
    if (fireworksRef.current) {
      fireworksRef.current.launch(count);
    }
  };

  const clearCanvas = () => {
    if (fireworksRef.current) {
      fireworksRef.current.clear();
    }
  };

  // Default container styles
  const defaultStyle = {
    position: 'relative',
    width: '100%',
    height: '400px',
    background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
    borderRadius: '10px',
    overflow: 'hidden',
    ...style
  };

  return (
    <div className={`fireworks-wrapper ${className}`} style={defaultStyle}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      
      {children && (
        <div style={{ position: 'relative', zIndex: 10 }}>
          {typeof children === 'function' 
            ? children({
                start: startFireworks,
                stop: stopFireworks,
                toggle: toggleFireworks,
                launch: launchFireworks,
                clear: clearCanvas,
                isRunning
              })
            : children
          }
        </div>
      )}
    </div>
  );
};

export default FireworksComponent;