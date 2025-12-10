
import React, { useEffect, useRef, useState } from 'react';

const SparkleCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailing, setTrailing] = useState<{ x: number; y: number; id: number }[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Add a new sparkle to the trail
      const newSparkle = { x: e.clientX, y: e.clientY, id: Date.now() };
      setTrailing((prev) => [...prev.slice(-15), newSparkle]); // Keep last 15
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const animate = () => {
      setTrailing((prev) => prev.filter((p) => Date.now() - p.id < 500)); // Remove old sparkles
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  // Don't render on touch devices generally, but keep for responsive req
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      {/* Main Cursor Dot */}
      <div 
        className="absolute w-3 h-3 bg-corporate-500 rounded-full blur-[1px] transition-transform duration-75 ease-out"
        style={{ left: position.x - 6, top: position.y - 6 }} 
      />
      
      {/* Trailing Sparkles */}
      {trailing.map((p) => (
        <div
          key={p.id}
          className="absolute w-1.5 h-1.5 bg-corporate-300 rounded-full animate-pulse"
          style={{ 
            left: p.x + (Math.random() * 10 - 5), 
            top: p.y + (Math.random() * 10 - 5),
            opacity: 1 - (Date.now() - p.id) / 500,
            transform: `scale(${1 - (Date.now() - p.id) / 500})`
          }}
        />
      ))}
    </div>
  );
};

export default SparkleCursor;
