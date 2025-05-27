import React from 'react';
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

  // Generate dates from November 2024 to December 2026
  const labels = Array.from({ length: 26 }, (_, i) => {
    const date = new Date(2024, 10 + i);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });

  const currentDate = new Date();
  const actualDataLength = Math.max(0, 
    (currentDate.getFullYear() - 2024) * 12 + currentDate.getMonth() - 10
  );

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
      label: 'Planned Trees',
      data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 1000) + 500),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }],
  };

  const plannedHaData = {
    labels,
    datasets: [{
      label: 'Planned Hectares',
      data: Array.from({ length: labels.length }, () => (Math.random() * 2 + 1).toFixed(2)),
      borderColor: 'rgb(153, 102, 255)',
      tension: 0.1,
    }],
  };

  const actualTreesData = {
    labels: labels.slice(0, actualDataLength),
    datasets: [{
      label: 'Actual Trees Planted',
      data: Array.from({ length: actualDataLength }, () => Math.floor(Math.random() * 1000) + 500),
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1,
    }],
  };

  const actualHaData = {
    labels: labels.slice(0, actualDataLength),
    datasets: [{
      label: 'Actual Hectares Planted',
      data: Array.from({ length: actualDataLength }, () => (Math.random() * 2 + 1).toFixed(2)),
      borderColor: 'rgb(255, 159, 64)',
      tension: 0.1,
    }],
  };

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
            <h3 className="text-xl font-semibold mb-4">Monthly Planned Trees</h3>
            <Line options={chartOptions} data={plannedTreesData} />
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
            <h3 className="text-xl font-semibold mb-4">Monthly Planned Hectares</h3>
            <Line options={chartOptions} data={plannedHaData} />
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
            <h3 className="text-xl font-semibold mb-4">Actual Trees Planted</h3>
            <Line options={chartOptions} data={actualTreesData} />
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
            <h3 className="text-xl font-semibold mb-4">Actual Hectares Planted</h3>
            <Line options={chartOptions} data={actualHaData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyStats;