import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend
} from 'recharts';
import { DataPoint } from '../types';

interface MultiLineData {
  name: string;
  data: DataPoint[];
  color: string;
}

interface MultiLineChartCardProps {
  title: string;
  subtitle: string;
  data: MultiLineData[];
  theme: 'dark' | 'light';
}

export const MultiLineChartCard: React.FC<MultiLineChartCardProps> = ({ 
  title, 
  subtitle, 
  data,
  theme
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [visibleLines, setVisibleLines] = useState<{ [key: string]: boolean }>(
    data.reduce((acc, item) => ({ ...acc, [item.name]: true }), {})
  );

  // Merge all datasets into one array with a metric property
  const mergedData = data[0].data.map((item, index) => {
    const result: any = { name: item.name };
    data.forEach(d => {
      result[d.name] = d.data[index].value;
    });
    return result;
  });

  const toggleLine = (dataKey: string) => {
    setVisibleLines({
      ...visibleLines,
      [dataKey]: !visibleLines[dataKey]
    });
  };

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
          <LineChart
            data={mergedData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
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
            <Legend 
              onClick={(e) => toggleLine(e.dataKey)}
              formatter={(value) => (
                <span className={visibleLines[value] ? '' : 'text-opacity-40 text-gray-400'}>
                  {value}
                </span>
              )}
            />
            {data.map((line, index) => (
              <defs key={`gradient-${index}`}>
                <linearGradient id={`lineGradient-${line.name}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={line.color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={line.color} stopOpacity={1} />
                </linearGradient>
              </defs>
            ))}
            {data.map((line) => (
              visibleLines[line.name] && (
                <Line
                  key={line.name}
                  type="monotone"
                  dataKey={line.name}
                  stroke={`url(#lineGradient-${line.name})`}
                  strokeWidth={isHovered ? 2.5 : 2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: line.color }}
                  animationDuration={2000}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};