import React, { useState } from 'react';
import { Trees as Tree, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { id } = useParams();
  const [showCumulative, setShowCumulative] = useState(false);

  // Generate dates from November 2024 to December 2026
  const labels = Array.from({ length: 26 }, (_, i) => {
    const date = new Date(2024, 10 + i);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });

  // Calculate actual data length based on current date
  const currentDate = new Date();
  const actualDataLength = Math.max(0, 
    (currentDate.getFullYear() - 2024) * 12 + currentDate.getMonth() - 10
  );

  // Sample data (replace with actual data from your source)
  const monthlyData = {
    plannedTrees: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 500) + 300),
    plannedHa: Array.from({ length: labels.length }, () => Number((Math.random() * 1.5 + 0.5).toFixed(2))),
    actualTrees: Array.from({ length: actualDataLength }, () => Math.floor(Math.random() * 500) + 300),
    actualHa: Array.from({ length: actualDataLength }, () => Number((Math.random() * 1.5 + 0.5).toFixed(2)))
  };

  const calculateCumulative = (data: number[]) => {
    return data.reduce((acc: number[], curr: number) => {
      const last = acc.length > 0 ? acc[acc.length - 1] : 0;
      return [...acc, last + curr];
    }, []);
  };

  const getChartData = (key: string, label: string, color: string) => {
    const monthly = monthlyData[key as keyof typeof monthlyData];
    const cumulative = calculateCumulative(monthly);
    const isActual = key.startsWith('actual');
    const chartLabels = isActual ? labels.slice(0, actualDataLength) : labels;

    return {
      labels: chartLabels,
      datasets: [{
        label: `${showCumulative ? 'Cumulative' : 'Monthly'} ${label}`,
        data: showCumulative ? cumulative : monthly,
        borderColor: color,
        backgroundColor: color,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        }
      }
    },
  };

  const ChartContainer = ({ 
    title, 
    chartId, 
    label, 
    color 
  }: { 
    title: string; 
    chartId: string; 
    label: string; 
    color: string; 
  }) => (
    <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="h-[300px]">
        <Line options={chartOptions} data={getChartData(chartId, label, color)} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tree className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-semibold tracking-tight">Monthly Statistics - {id === '1' ? 'Project' : `Phase ${id}`}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCumulative(!showCumulative)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showCumulative
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-white/70 hover:bg-slate-600'
              }`}
            >
              {showCumulative ? 'Show Monthly' : 'Show Cumulative'}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ChartContainer
            title="Planned Trees"
            chartId="plannedTrees"
            label="Trees"
            color="rgb(75, 192, 192)"
          />
          <ChartContainer
            title="Planned Hectares"
            chartId="plannedHa"
            label="Hectares"
            color="rgb(153, 102, 255)"
          />
          <ChartContainer
            title="Actual Trees Planted"
            chartId="actualTrees"
            label="Trees"
            color="rgb(255, 99, 132)"
          />
          <ChartContainer
            title="Actual Hectares Planted"
            chartId="actualHa"
            label="Hectares"
            color="rgb(255, 159, 64)"
          />
        </div>
      </div>
    </div>
  );
}

export default MonthlyStats;