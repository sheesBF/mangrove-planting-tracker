import React from 'react';
import { Leaf } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-6 md:p-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-white" />
          <span className="text-xl font-semibold text-white">MozBlue Monitoring</span>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {['About', 'Gallery', 'Conservation', 'Contact'].map((item) => (
              <li key={item}>
                <a 
                  href="#" 
                  className="text-white/80 hover:text-white transition-colors duration-300"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button className="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;