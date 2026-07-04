import React, { useEffect, useState } from 'react';

// Tailwind keyframes are best added in index.css, but we can also use inline styles or just arbitrary tailwind classes if we configure it.
// To keep it self-contained, we'll use inline animation styles.
const sparkleAnimation = `
@keyframes floatUpAndFade {
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  50% { opacity: 1; transform: translateY(-20px) scale(1); }
  100% { transform: translateY(-40px) scale(0.5); opacity: 0; }
}
`;

export default function CSSSparkles() {
  const [particles, setParticles] = useState<Array<{ id: number, left: number, top: number, delay: number, duration: number, size: number }>>([]);

  useEffect(() => {
    // Generate some particles initially
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen">
      <style>{sparkleAnimation}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-amber-400 shadow-[0_0_10px_2px_rgba(251,191,36,0.6)]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animation: `floatUpAndFade ${p.duration}s ease-in-out ${p.delay}s infinite`,
            opacity: 0, // starts invisible
          }}
        />
      ))}
    </div>
  );
}
