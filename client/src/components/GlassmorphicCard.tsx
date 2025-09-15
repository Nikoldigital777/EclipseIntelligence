import { ReactNode, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  borderColor?: "blue" | "red" | "gold" | "green" | "eclipse" | "nebula" | "teal";
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
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getBorderStyles = () => {
    switch (borderColor) {
      case "blue":
        return "border-l-4 border-l-[#2E3A59]";
      case "red":
        return "border-l-4 border-l-[hsl(var(--remax-red))]";
      case "gold":
        return "border-l-4 border-l-[#D4AF37]";
      case "green":
        return "border-l-4 border-l-[hsl(var(--success-green))]";
      case "eclipse":
        return "border-l-4 border-l-[#00D9FF]";
      case "nebula":
        return "border-l-4 border-l-[#6C63FF]";
      case "teal":
        return "border-l-4 border-l-[#00D9FF]";
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

    const rotateX = (mousePosition.y - centerY) / centerY * -1.5;
    const rotateY = (mousePosition.x - centerX) / centerX * 1.5;

    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.005, 1.005, 1.005)`,
      transition: isHovered ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    };
  };

  const getGlowStyles = () => {
    if (!tiltEffect || !isHovered || !cardRef.current) return {};

    const rect = cardRef.current.getBoundingClientRect();

    const glowX = (mousePosition.x / rect.width) * 100;
    const glowY = (mousePosition.y / rect.height) * 100;

    return {
      background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(0, 217, 255, 0.03), transparent 70%)`,
    };
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        intense ? "glassmorphism-intense premium-shadow" : "glassmorphism enhanced-card",
        "rounded-xl p-6 relative overflow-hidden smooth-transition",
        hover && "enhanced-hover",
        tiltEffect && "transition-transform duration-200 ease-out",
        !isVisible && "opacity-0 translate-y-4",
        isVisible && "animate-fade-in-scale",
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

      {/* Enhanced floating particles for intense cards */}
      {intense && (
        <>
          <div className="absolute top-4 right-4 w-2 h-2 bg-[#00D9FF] rounded-full animate-twinkle opacity-60" />
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-[#6C63FF] rounded-full animate-twinkle opacity-40" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-twinkle opacity-70" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-[#E8E9F3] rounded-full animate-twinkle opacity-30" style={{ animationDelay: '3s' }} />

          {/* Ambient glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/3 via-transparent to-[#6C63FF]/3 pointer-events-none" />
        </>
      )}

      {/* Enhanced border accent with cosmic silver shimmer */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-[#E8E9F3]/15 to-transparent opacity-30 pointer-events-none" style={{ height: '1px' }} />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}