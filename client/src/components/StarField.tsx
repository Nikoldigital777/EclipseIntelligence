import { useEffect, useRef, useState } from "react";

export default function StarField() {
  const starFieldRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const createStars = () => {
      if (!starFieldRef.current) return;

      const stars = [];
      
      // Create different layers of stars with varying sizes and speeds
      const starLayers = [
        { count: 30, size: 1, opacity: 0.3, speed: 0.5 },
        { count: 20, size: 2, opacity: 0.5, speed: 0.8 },
        { count: 15, size: 1.5, opacity: 0.7, speed: 1.2 },
        { count: 10, size: 3, opacity: 0.9, speed: 1.5 },
      ];

      starLayers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
          const star = document.createElement("div");
          star.className = `absolute rounded-full bg-white animate-twinkle`;
          star.style.width = `${layer.size}px`;
          star.style.height = `${layer.size}px`;
          star.style.top = `${Math.random() * 100}%`;
          star.style.left = `${Math.random() * 100}%`;
          star.style.opacity = `${layer.opacity}`;
          star.style.animationDelay = `${Math.random() * 4}s`;
          star.style.animationDuration = `${3 + Math.random() * 2}s`;
          star.dataset.layer = layerIndex.toString();
          star.dataset.speed = layer.speed.toString();
          stars.push(star);
        }
      });

      // Add some shooting stars
      for (let i = 0; i < 3; i++) {
        const shootingStar = document.createElement("div");
        shootingStar.className = "absolute w-1 h-1 bg-white rounded-full";
        shootingStar.style.top = `${Math.random() * 50}%`;
        shootingStar.style.left = `${Math.random() * 100}%`;
        shootingStar.style.boxShadow = "0 0 6px 2px rgba(62, 243, 255, 0.8)";
        shootingStar.style.animation = `shooting-star ${3 + Math.random() * 2}s linear infinite`;
        shootingStar.style.animationDelay = `${Math.random() * 10}s`;
        stars.push(shootingStar);
      }

      starFieldRef.current.replaceChildren(...stars);
    };

    createStars();
  }, []);

  // Parallax effect based on mouse movement
  useEffect(() => {
    if (!starFieldRef.current) return;

    const stars = starFieldRef.current.children;
    Array.from(stars).forEach((star) => {
      const element = star as HTMLElement;
      const layer = parseInt(element.dataset.layer || '0');
      const speed = parseFloat(element.dataset.speed || '1');
      
      const moveX = (mousePos.x - 50) * speed * 0.1;
      const moveY = (mousePos.y - 50) * speed * 0.1;
      
      element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }, [mousePos]);

  return (
    <>
      {/* Aurora background layer */}
      <div className="fixed inset-0 animate-aurora pointer-events-none z-0" />
      
      {/* Star field */}
      <div
        ref={starFieldRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ zIndex: 1 }}
      />
      

    </>
  );
}
