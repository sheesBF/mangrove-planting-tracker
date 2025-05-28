import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { DataPoint } from '../types';

interface AreaChartCardProps {
  title: string;
  subtitle: string;
  data: DataPoint[];
  color: string;
  theme: 'dark' | 'light';
}

export const AreaChartCard: React.FC<AreaChartCardProps> = ({ 
  title, 
  subtitle, 
  data, 
  color,
  theme
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className={`glass-card ${theme === 'light' ? 'bg-white/80 border-slate-200' : ''} p-6 h-[300px]`}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{subtitle}</p>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id={`areaGradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={isHovered ? 3 : 2}
              fillOpacity={1}
              fill={`url(#areaGradient-${title})`}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};