import React, { useState, useEffect, useRef } from 'react';
import { Coins, Gem, Sparkles, Scale, Crown, Trophy, HandCoins, CircleDollarSign, BadgeCheck } from 'lucide-react';

const ICONS = [Coins, Gem, Sparkles, Scale, Trophy, HandCoins, CircleDollarSign, BadgeCheck];

export default function InteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    // Generate random elements once
    const newElements = Array.from({ length: 24 }).map((_, i) => {
      const Icon = ICONS[i % ICONS.length];
      return {
        id: i,
        Icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 20, // 20-40px
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2
      };
    });
    setElements(newElements);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      setElements(prev => prev.map(el => {
        let newX = el.x + el.speedX * (deltaTime / 16);
        let newY = el.y + el.speedY * (deltaTime / 16);
        let newRot = el.rotation + el.rotSpeed * (deltaTime / 16);

        // Wrap around
        if (newX < -10) newX = 110;
        if (newX > 110) newX = -10;
        if (newY < -10) newY = 110;
        if (newY > 110) newY = -10;

        return { ...el, x: newX, y: newY, rotation: newRot };
      }));

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ zIndex: 0 }}
    >
      {elements.map(el => {
        // Calculate distance from mouse
        let displayX = el.x;
        let displayY = el.y;
        
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const pixelX = (el.x / 100) * rect.width;
          const pixelY = (el.y / 100) * rect.height;
          
          const dx = pixelX - mousePos.x;
          const dy = pixelY - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Repel effect (game-like interaction)
          if (dist < 150) {
            const repelForce = (150 - dist) / 150;
            displayX += (dx / dist) * repelForce * 5; // offset in %
            displayY += (dy / dist) * repelForce * 5;
          }
        }

        const Icon = el.Icon;

        return (
          <div
            key={el.id}
            className="absolute text-amber-200/40 transition-transform duration-75 ease-out"
            style={{
              left: `${displayX}%`,
              top: `${displayY}%`,
              transform: `translate(-50%, -50%) rotate(${el.rotation}deg)`,
            }}
          >
            <Icon size={el.size} strokeWidth={1.5} />
          </div>
        );
      })}
    </div>
  );
}
