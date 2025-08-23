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

    // Hide default cursor
    document.body.style.cursor = 'none';

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

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed w-6 h-6 rounded-full pointer-events-none z-[9999] transition-all duration-150 ease-out mix-blend-difference"
        style={getCursorStyles()}
      />
      
      {/* Cursor trail */}
      <div
        className="fixed w-3 h-3 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out opacity-30"
        style={{
          ...getTrailStyles(),
          background: cursorVariant === 'hover' 
            ? 'hsl(var(--eclipse-glow))' 
            : cursorVariant === 'click'
            ? 'hsl(var(--remax-red))'
            : 'rgba(255, 255, 255, 0.5)',
        }}
      />
      
      {/* Outer ring */}
      <div
        className="fixed w-8 h-8 rounded-full border border-white/20 pointer-events-none z-[9997] transition-all duration-500 ease-out"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          transform: isHovering ? 'scale(2)' : 'scale(1)',
          opacity: isHovering ? 0.8 : 0.3,
        }}
      />
    </>
  );
}