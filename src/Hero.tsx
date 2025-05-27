import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/40 z-10"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out'
        }}
      />
      
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 2s ease-in-out'
        }}
      />
      
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/12489836/pexels-photo-12489836.jpeg?auto=compress&cs=tinysrgb&w=1920")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          transform: `translateY(${scrollY * 0.2}px)`,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      />
      
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: `translateY(${isLoaded ? 0 : '20px'})`,
          transition: 'opacity 2s ease-in-out, transform 2s ease-in-out'
        }}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-8">
          MozBlue Project 1 Planting
        </h1>
        <button 
          onClick={() => navigate('/tracking')}
          className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
        >
          Track Progress
        </button>
      </div>
    </section>
  );
};

export default Hero;