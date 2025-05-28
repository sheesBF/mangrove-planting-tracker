import React from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <motion.button
      onClick={toggleTheme}
      className={`glass-button p-2 rounded-full flex items-center justify-center`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {theme === 'dark' ? (
        <SunIcon size={20} className="text-yellow-400" />
      ) : (
        <MoonIcon size={20} className="text-slate-700" />
      )}
    </motion.button>
  );
};