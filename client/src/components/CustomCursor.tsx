import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'click'>('default');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setCursorVariant('click');
    const handleMouseUp = () => setCursorVariant(isHovering ? 'hover' : 'default');

    // Handle hovering over interactive elements
    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], .micro-interaction, .hover-glow')) {
        setIsHovering(true);
        setCursorVariant('hover');
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], .micro-interaction, .hover-glow')) {
        setIsHovering(false);
        setCursorVariant('default');
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    // Hide default cursor only on larger screens
    if (window.innerWidth > 768) {
      document.body.style.cursor = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, [isHovering]);

  const getCursorStyles = () => {
    const baseStyles = {
      left: mousePosition.x - 12,
      top: mousePosition.y - 12,
    };

    switch (cursorVariant) {
      case 'hover':
        return {
          ...baseStyles,
          transform: 'scale(1.5)',
          background: 'linear-gradient(45deg, hsl(var(--eclipse-glow)), hsl(var(--lunar-mist)))',
          boxShadow: '0 0 20px rgba(62, 243, 255, 0.6)',
        };
      case 'click':
        return {
          ...baseStyles,
          transform: 'scale(0.8)',
          background: 'linear-gradient(45deg, hsl(var(--remax-red)), hsl(var(--gold-manifest)))',
          boxShadow: '0 0 30px rgba(238, 39, 55, 0.8)',
        };
      default:
        return {
          ...baseStyles,
          background: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
        };
    }
  };

  const getTrailStyles = () => {
    return {
      left: mousePosition.x - 6,
      top: mousePosition.y - 6,
    };
  };

  // Only show custom cursor on desktop
  if (window.innerWidth <= 768) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed w-4 h-4 rounded-full pointer-events-none z-[9999] transition-all duration-100 ease-out"
        style={getCursorStyles()}
      />
    </>
  );
}