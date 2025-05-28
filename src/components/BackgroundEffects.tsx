import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BackgroundEffectsProps {
  theme: 'dark' | 'light';
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Particle[] = [];
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = theme === 'dark' 
          ? `rgba(${Math.floor(Math.random() * 50 + 50)}, ${Math.floor(Math.random() * 50 + 100)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.3 + 0.1})`
          : `rgba(${Math.floor(Math.random() * 50 + 150)}, ${Math.floor(Math.random() * 50 + 150)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.15 + 0.05})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const init = () => {
      particles = [];
      for (let i = 0; i < 30; i++) {
        particles.push(new Particle());
      }
    };
    
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connect nearby particles with lines
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = theme === 'dark' 
              ? `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`
              : `rgba(0, 0, 0, ${0.05 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };
    
    window.addEventListener('resize', handleResize);
    
    init();
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);
  
  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
      ></canvas>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <motion.div 
          className="absolute top-[20%] left-[20%] w-[40vw] h-[40vh] rounded-full opacity-20 filter blur-[80px]"
          animate={{
            backgroundColor: ['rgba(59, 130, 246, 0.2)', 'rgba(139, 92, 246, 0.2)', 'rgba(59, 130, 246, 0.2)'],
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vh] rounded-full opacity-20 filter blur-[100px]"
          animate={{
            backgroundColor: ['rgba(139, 92, 246, 0.2)', 'rgba(59, 130, 246, 0.2)', 'rgba(139, 92, 246, 0.2)'],
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </>
  );
};