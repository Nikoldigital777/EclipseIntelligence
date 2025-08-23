import { ReactNode, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  borderColor?: "blue" | "red" | "gold" | "green" | "eclipse";
  intense?: boolean;
  tiltEffect?: boolean;
  style?: React.CSSProperties;
}

export default function GlassmorphicCard({
  children,
  className,
  hover = true,
  borderColor,
  intense = false,
  tiltEffect = false,
  style,
}: GlassmorphicCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const getBorderStyles = () => {
    switch (borderColor) {
      case "blue":
        return "border-l-4 border-l-[hsl(var(--manifest-blue))]";
      case "red":
        return "border-l-4 border-l-[hsl(var(--remax-red))]";
      case "gold":
        return "border-l-4 border-l-[hsl(var(--gold-manifest))]";
      case "green":
        return "border-l-4 border-l-[hsl(var(--success-green))]";
      case "eclipse":
        return "border-l-4 border-l-[hsl(var(--eclipse-glow))]";
      default:
        return "";
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEffect || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const getTiltStyles = () => {
    if (!tiltEffect || !isHovered || !cardRef.current) return {};

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (mousePosition.y - centerY) / centerY * -10;
    const rotateY = (mousePosition.x - centerX) / centerX * 10;

    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: isHovered ? 'none' : 'transform 0.5s ease-out',
    };
  };

  const getGlowStyles = () => {
    if (!tiltEffect || !isHovered || !cardRef.current) return {};

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const glowX = (mousePosition.x / rect.width) * 100;
    const glowY = (mousePosition.y / rect.height) * 100;

    return {
      background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(62, 243, 255, 0.1), transparent 50%)`,
    };
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        intense ? "glassmorphism-intense" : "glassmorphism",
        "rounded-xl p-6 relative overflow-hidden",
        hover && "hover-glow",
        tiltEffect && "transition-transform duration-300 ease-out",
        getBorderStyles(),
        className
      )}
      style={{
        ...style,
        ...(tiltEffect ? getTiltStyles() : {}),
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic glow overlay */}
      {tiltEffect && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={getGlowStyles()}
        />
      )}
      
      {/* Subtle floating particles for intense cards */}
      {intense && (
        <>
          <div className="absolute top-4 right-4 w-1 h-1 bg-[hsl(var(--eclipse-glow))] rounded-full animate-twinkle" />
          <div className="absolute bottom-6 left-8 w-0.5 h-0.5 bg-[hsl(var(--lunar-mist))] rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-[hsl(var(--gold-manifest))] rounded-full animate-twinkle" style={{ animationDelay: '2s' }} />
        </>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
