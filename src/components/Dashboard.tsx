import React from 'react';
import { motion } from 'framer-motion';
import { LineChartCard } from './LineChartCard';
import { AreaChartCard } from './AreaChartCard';
import { generateLineData, generateAreaData, generateBarData } from '../utils/demoData';
import { BarChartCard } from './BarChartCard';
import { MultiLineChartCard } from './MultiLineChartCard';

interface DashboardProps {
  theme: 'dark' | 'light';
}

export const Dashboard: React.FC<DashboardProps> = ({ theme }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <motion.div variants={item} className="lg:col-span-2">
        <LineChartCard 
          title="Revenue Growth" 
          subtitle="Monthly progression" 
          data={generateLineData()} 
          color="#3b82f6"
          theme={theme}
        />
      </motion.div>
      <motion.div variants={item}>
        <AreaChartCard 
          title="User Engagement" 
          subtitle="Daily active users" 
          data={generateAreaData()} 
          color="#8b5cf6"
          theme={theme}
        />
      </motion.div>
      <motion.div variants={item}>
        <BarChartCard 
          title="Conversion Rates" 
          subtitle="By channel" 
          data={generateBarData()} 
          color="#14b8a6"
          theme={theme}
        />
      </motion.div>
      <motion.div variants={item} className="lg:col-span-2">
        <MultiLineChartCard 
          title="Performance Metrics" 
          subtitle="Key indicators" 
          data={[
            { name: 'Metric A', data: generateLineData(), color: '#3b82f6' },
            { name: 'Metric B', data: generateLineData(), color: '#8b5cf6' },
            { name: 'Metric C', data: generateLineData(), color: '#14b8a6' }
          ]}
          theme={theme}
        />
      </motion.div>
      <motion.div variants={item}>
        <AreaChartCard 
          title="Profit Margin" 
          subtitle="Quarterly results" 
          data={generateAreaData()} 
          color="#f472b6" 
          theme={theme}
        />
      </motion.div>
    </motion.div>
  );
};