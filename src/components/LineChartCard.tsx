import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, Legend
} from 'recharts';
import { DataPoint } from '../types';
import { InfoIcon } from 'lucide-react';

interface LineChartCardProps {
  title: string;
  subtitle: string;
  data: DataPoint[];
  color: string;
  theme: 'dark' | 'light';
}

export const LineChartCard: React.FC<LineChartCardProps> = ({ 
  title, 
  subtitle, 
  data, 
  color,
  theme
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <motion.div 
      className={`glass-card ${theme === 'light' ? 'bg-white/80 border-slate-200' : ''} p-6 h-[300px] relative overflow-hidden`}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{subtitle}</p>
        </div>
        <motion.button 
          className="glass-button p-1 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInfo(!showInfo)}
        >
          <InfoIcon size={18} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} />
        </motion.button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div 
            className={`absolute top-16 right-6 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} p-3 rounded-lg shadow-lg z-10`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm max-w-xs">
              This chart shows trending data over time with a dynamic curve that
              responds to your interactions. Hover over data points for detailed information.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id={`colorGradient-${title}`} x1="0" y1="0" x2="0" y2="1">
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
            <ReferenceLine y={0} stroke={theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={isHovered ? 3 : 2}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 0, fill: color }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};