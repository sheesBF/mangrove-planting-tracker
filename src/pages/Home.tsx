import React, { useEffect, useState } from 'react';
import { Trees as Tree } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tree className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-semibold tracking-tight">MozBlue Monitoring</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backgroundImage: 'url("https://images.pexels.com/photos/5967957/pexels-photo-5967957.jpeg?auto=compress&cs=tinysrgb&w=1600")',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-900/80"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-center max-w-3xl px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">MozBlue Planting Tracker</h2>
            <button 
              onClick={() => navigate('/tracking')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-lg"
            >
              Track Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;