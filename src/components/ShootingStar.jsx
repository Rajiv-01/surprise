import React, { useEffect, useRef } from "react";

export default function ShootingStars() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const createStar = (x, y) => {
      const star = document.createElement("div");
      star.className = "shooting-star";
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      container.appendChild(star);
      setTimeout(() => star.remove(), 1000);
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      createStar(clientX, clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
