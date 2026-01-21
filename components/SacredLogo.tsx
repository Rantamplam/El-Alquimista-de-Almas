
import React, { useState, useEffect, useRef } from 'react';

// Intentamos cargar el logo local, pero el motor de Canvas ahora es la estrella principal
const LOGO_URL = "./logo.gif";

export const SacredLogo: React.FC<{ size?: string }> = ({ size = "w-24 h-24" }) => {
  const [hasError, setHasError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Si el GIF carga, no activamos el Canvas (opcional, pero el Canvas ahora es mejor)
    // Para asegurar que el usuario vea la versión mejorada, activamos el motor si no hay GIF
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const draw = () => {
      time += 0.01;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const baseRadius = w * 0.38;

      ctx.clearRect(0, 0, w, h);
      
      // 1. DIBUJAR EL HEXAGRAMA (Geometría del Marco)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.1);
      
      const drawTriangle = (rot: number) => {
        ctx.save();
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#eab308';
        
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3;
          const x = Math.cos(angle) * baseRadius;
          const y = Math.sin(angle) * baseRadius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        
        // Efecto de "hilos" internos
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * baseRadius, Math.sin(angle) * baseRadius);
            ctx.stroke();
        }
        ctx.restore();
      };

      drawTriangle(0);
      drawTriangle(Math.PI); // Invertido para formar el hexagrama
      ctx.restore();

      // 2. EL VÓRTICE CENTRAL (Espiral Alquímica)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-time * 0.5);
      
      for (let i = 0; i < 60; i++) {
        const spiralAngle = i * 0.2 + time;
        const dist = (i * baseRadius * 0.6) / 60;
        const x = Math.cos(spiralAngle) * dist;
        const y = Math.sin(spiralAngle) * dist;
        const pSize = Math.max(0.5, (60 - i) / 15);
        
        ctx.beginPath();
        ctx.fillStyle = i < 10 ? '#fffbeb' : 'rgba(234, 179, 8, ' + (1 - i/60) + ')';
        ctx.arc(x, y, pSize, 0, Math.PI * 2);
        ctx.fill();
        
        if (i % 5 === 0) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#fbbf24';
        }
      }
      ctx.restore();

      // 3. ANILLO DE LUZ EXTERIOR
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.1)';
      ctx.setLineDash([5, 15]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. CHISPAS ORBITALES
      for (let i = 0; i < 8; i++) {
          const orbAngle = time * 0.8 + (i * Math.PI * 2 / 8);
          const orbX = cx + Math.cos(orbAngle) * baseRadius * 1.05;
          const orbY = cy + Math.sin(orbAngle) * baseRadius * 1.05;
          
          ctx.beginPath();
          ctx.fillStyle = '#fef3c7';
          ctx.arc(orbX, orbY, 1.5, 0, Math.PI * 2);
          ctx.shadowBlur = 10;
          ctx.fill();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [hasError]);

  return (
    <div className={`${size} mx-auto relative flex items-center justify-center`}>
      {/* 
         Mantenemos el intento de carga del GIF, pero el Canvas está debajo 
         siempre listo para brillar si hay transparencia o error.
      */}
      <img 
        src={LOGO_URL} 
        alt="Adytum Emblema" 
        onError={() => setHasError(true)}
        className={`absolute inset-0 w-full h-full rounded-full mix-blend-screen filter drop-shadow-[0_0_30px_rgba(234,179,8,0.7)] object-cover transition-opacity duration-1000 ${hasError ? 'opacity-0' : 'opacity-100'}`}
      />
      
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300} 
        className={`w-full h-full pointer-events-none transition-opacity duration-1000 ${hasError ? 'opacity-100' : 'opacity-40'}`}
      />
      
      {/* Aura de profundidad adicional */}
      <div className="absolute inset-0 rounded-full bg-amber-500/5 blur-2xl animate-pulse"></div>
    </div>
  );
};
