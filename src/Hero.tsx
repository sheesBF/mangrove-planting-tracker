
import React from 'react';

const Hero = () => {
  return (
    <section className="bg-slate-900 text-white py-20 px-6 text-center relative overflow-hidden font-montserrat">
      <div className="max-w-4xl mx-auto z-10 relative">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Track your <span className="text-emerald-400">mangrove impact</span>
        </h1>
        <p className="text-lg text-slate-300 mb-8">
          A visual showcase of planting progress and reforestation efforts.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-full font-semibold text-white shadow-md">
            Track Now
          </button>
          <button className="px-6 py-3 border border-white rounded-full text-white hover:bg-white/10">
            Learn More
          </button>
        </div>
      </div>

      <img
        src="/coastal-illustration.png"
        alt="Mangrove coastal illustration"
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-3xl opacity-20 pointer-events-none"
      />
    </section>
  );
};

export default Hero;
