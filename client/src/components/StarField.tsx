import { useEffect, useRef } from "react";

export default function StarField() {
  const starFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createStars = () => {
      if (!starFieldRef.current) return;

      const numStars = 50;
      const stars = [];

      for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.className = "star animate-twinkle";
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        stars.push(star);
      }

      starFieldRef.current.replaceChildren(...stars);
    };

    createStars();
  }, []);

  return (
    <div
      ref={starFieldRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ zIndex: 1 }}
    />
  );
}
