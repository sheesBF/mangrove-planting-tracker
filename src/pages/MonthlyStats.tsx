import React, { useState } from 'react';
import { Trees as Tree, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MonthlyStats() {
  const navigate = useNavigate();
  const [showCumulative, setShowCumulative] = useState({
    plannedTrees: false,
    plannedHa: false,
    actualTrees: false,
    actualHa: false
  });

  // Generate dates from November 2024 to December 2026
  const labels = Array.from({ length: 26 }, (_, i) => {
    const date = new Date(2024, 10 + i);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });

  const currentDate = new Date();
  const actualDataLength = Math.max(0, 
    (currentDate.getFullYear() - 2024) * 12 + currentDate.getMonth() - 10
  );

  // Generate random monthly data
  const monthlyPlannedTrees = Array.from({ length: labels.length }, () => Math.floor(Math.random() * 1000) + 500);
  const monthlyPlannedHa = Array.from({ length: labels.length }, () => Number((Math.random() * 2 + 1).toFixed(2)));
  const monthlyActualTrees = Array.from({ length: actualDataLength }, () => Math.floor(Math.random() * 1000) + 500);
  const monthlyActualHa = Array.from({ length: actualDataLength }, () => Number((Math.random() * 2 + 1).toFixed(2)));

  // Calculate cumulative data
  const cumulativePlannedTrees = monthlyPlannedTrees.reduce((acc, curr, i) => [...acc, (acc[i - 1] || 0) + curr], []);
  const cumulativePlannedHa = monthlyPlannedHa.reduce((acc, curr, i) => [...acc, Number((acc[i - 1] || 0) + curr).toFixed(2)], []);
  const cumulativeActualTrees = monthlyActualTrees.reduce((acc, curr, i) => [...acc, (acc[i - 1] || 0) + curr], []);
  const cumulativeActualHa = monthlyActualHa.reduce((acc, curr, i) => [...acc, Number((acc[i - 1] || 0) + curr).toFixed(2)], []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const plannedTreesData = {
    labels,
    datasets: [{
      label: showCumulative.plannedTrees ? 'Cumulative Planned Trees' : 'Monthly Planned Trees',
      data: showCumulative.plannedTrees ? cumulativePlannedTrees : monthlyPlannedTrees,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }],
  };

  const plannedHaData = {
    labels,
    datasets: [{
      label: showCumulative.plannedHa ? 'Cumulative Planned Hectares' : 'Monthly Planned Hectares',
      data: showCumulative.plannedHa ? cumulativePlannedHa : monthlyPlannedHa,
      borderColor: 'rgb(153, 102, 255)',
      tension: 0.1,
    }],
  };

  const actualTreesData = {
    labels: labels.slice(0, actualDataLength),
    datasets: [{
      label: showCumulative.actualTrees ? 'Cumulative Trees Planted' : 'Monthly Trees Planted',
      data: showCumulative.actualTrees ? cumulativeActualTrees : monthlyActualTrees,
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1,
    }],
  };

  const actualHaData = {
    labels: labels.slice(0, actualDataLength),
    datasets: [{
      label: showCumulative.actualHa ? 'Cumulative Hectares Planted' : 'Monthly Hectares Planted',
      data: showCumulative.actualHa ? cumulativeActualHa : monthlyActualHa,
      borderColor: 'rgb(255, 159, 64)',
      tension: 0.1,
    }],
  };

  const ToggleButton = ({ isActive, onClick, children }: { isActive: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-emerald-500 text-white' 
          : 'bg-slate-700 text-white/70 hover:bg-slate-600'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tree className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-semibold tracking-tight">Monthly Statistics</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Planned Trees</h3>
              <ToggleButton
                isActive={showCumulative.plannedTrees}
                onClick={() => setShowCumulative(prev => ({ ...prev, plannedTrees: !prev.plannedTrees }))}
              >
                {showCumulative.plannedTrees ? 'Show Monthly' : 'Show Cumulative'}
              </ToggleButton>
            </div>
            <Line options={chartOptions} data={plannedTreesData} />
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Planned Hectares</h3>
              <ToggleButton
                isActive={showCumulative.plannedHa}
                onClick={() => setShowCumulative(prev => ({ ...prev, plannedHa: !prev.plannedHa }))}
              >
                {showCumulative.plannedHa ? 'Show Monthly' : 'Show Cumulative'}
              </ToggleButton>
            </div>
            <Line options={chartOptions} data={plannedHaData} />
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Actual Trees Planted</h3>
              <ToggleButton
                isActive={showCumulative.actualTrees}
                onClick={() => setShowCumulative(prev => ({ ...prev, actualTrees: !prev.actualTrees }))}
              >
                {showCumulative.actualTrees ? 'Show Monthly' : 'Show Cumulative'}
              </ToggleButton>
            </div>
            <Line options={chartOptions} data={actualTreesData} />
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Actual Hectares Planted</h3>
              <ToggleButton
                isActive={showCumulative.actualHa}
                onClick={() => setShowCumulative(prev => ({ ...prev, actualHa: !prev.actualHa }))}
              >
                {showCumulative.actualHa ? 'Show Monthly' : 'Show Cumulative'}
              </ToggleButton>
            </div>
            <Line options={chartOptions} data={actualHaData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyStats;