import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import { DataPoint } from '../types';

interface BarChartCardProps {
  title: string;
  subtitle: string;
  data: DataPoint[];
  color: string;
  theme: 'dark' | 'light';
}

export const BarChartCard: React.FC<BarChartCardProps> = ({ 
  title, 
  subtitle, 
  data, 
  color,
  theme
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const handleMouseEnter = (_, index: number) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <motion.div 
      className={`glass-card ${theme === 'light' ? 'bg-white/80 border-slate-200' : ''} p-6 h-[300px]`}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{subtitle}</p>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            onMouseMove={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
            <XAxis 
              dataKey="name" 
              stroke={theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
              tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
            />
            <YAxis 
              stroke={theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
              tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)',
                borderRadius: '0.5rem',
                color: theme === 'dark' ? 'white' : 'black'
              }}
            />
            <defs>
              <linearGradient id={`barGradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <Bar 
              dataKey="value" 
              fill={`url(#barGradient-${title})`}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={activeIndex === index ? color : `url(#barGradient-${title})`}
                  fillOpacity={activeIndex === index ? 1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};