
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart, LineElement, CategoryScale, LinearScale,
  PointElement, Tooltip, Legend
} from 'chart.js';
import { supabase } from '../services/supabaseClient';
import dayjs from 'dayjs';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// Force animation even if prefers-reduced-motion is on
Chart.defaults.animation = {
  duration: 2000,
  easing: 'easeOutQuart',
};

const Project1MonthlyData = () => {
  const navigate = useNavigate();
  const [labels, setLabels] = useState<string[]>([]);
  const [plannedTrees, setPlannedTrees] = useState<number[]>([]);
  const [actualTrees, setActualTrees] = useState<number[]>([]);
  const [plannedHectares, setPlannedHectares] = useState<number[]>([]);
  const [actualHectares, setActualHectares] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  const [renderKey, setRenderKey] = useState(0);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          usePointStyle: false,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, i) => ({
              text: dataset.label,
              strokeStyle: dataset.borderColor,
              lineWidth: 2,
              hidden: !chart.isDatasetVisible(i),
              index: i,
            }));
          }
        }
      },
    }
    scales: {
      x: {
        ticks: { color: '#ccc' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: {
        ticks: { color: '#ccc' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      const phaseTables = ['phase1_monthly_data', 'phase2_monthly_data', 'phase3_monthly_data'];
      const start = dayjs('2024-11-01');
      const now = dayjs().subtract(1, 'month');
      let current = start;

      const labelList: string[] = [];
      const plannedT: number[] = [];
      const actualT: number[] = [];
      const plannedH: number[] = [];
      const actualH: number[] = [];

      while (current.isBefore(now) || current.isSame(now)) {
        const monthLabel = current.format('MMMM YYYY');
        const monthKey = current.format('YYYY-MM-01');

        const queries = await Promise.all(
          phaseTables.map((table) =>
            supabase
              .from(table)
              .select('*')
              .eq('month', monthKey)
          )
        );

        const combined = queries
          .flatMap(({ data }) => data || [])
          .reduce(
            (acc, entry) => {
              acc.planned_trees += entry.planned_trees || 0;
              acc.actual_trees += entry.actual_trees || 0;
              acc.planned_hectares += parseFloat(entry.planned_hectares || 0);
              acc.actual_hectares += parseFloat(entry.actual_hectares || 0);
              return acc;
            },
            { planned_trees: 0, actual_trees: 0, planned_hectares: 0, actual_hectares: 0 }
          );

        labelList.push(monthLabel);
        plannedT.push(combined.planned_trees);
        actualT.push(combined.actual_trees);
        plannedH.push(combined.planned_hectares);
        actualH.push(combined.actual_hectares);

        current = current.add(1, 'month');
      }

      setLabels(labelList);
      setPlannedTrees(plannedT);
      setActualTrees(actualT);
      setPlannedHectares(plannedH);
      setActualHectares(actualH);
    }

    fetchData();
  }, []);

  const treeData = {
    labels,
    datasets: [
      {
        label: 'Planned Trees',
        data: plannedTrees,
        borderColor: 'rgba(255,255,255,0.6)',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Actual Trees',
        data: actualTrees,
        borderColor: 'rgba(34,197,94,1)',
        backgroundColor: '#ffffff',
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const hectareData = {
    labels,
    datasets: [
      {
        label: 'Planned Area (ha)',
        data: plannedHectares,
        borderColor: 'rgba(255,255,255,0.4)',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Actual Area (ha)',
        data: actualHectares,
        borderColor: 'rgba(94,234,212,1)',
        backgroundColor: '#ffffff',
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Project 1 – Monthly Tree Data</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md border ${activeTab === 'chart' ? 'bg-white/10 border-white text-white' : 'border-gray-400 text-gray-300'}`}
          onClick={() => {
            setActiveTab('chart');
            setRenderKey(prev => prev + 1);
          }}
        >
          Show Chart
        </button>
        <button
          className={`px-4 py-2 rounded-md border ${activeTab === 'table' ? 'bg-white/10 border-white text-white' : 'border-gray-400 text-gray-300'}`}
          onClick={() => setActiveTab('table')}
        >
          Show Table
        </button>
      </div>

      {activeTab === 'chart' ? (
        <>
          <div className="glass rounded-xl shadow-xl p-6 bg-slate-800/40 backdrop-blur mb-10">
            <h2 className="text-xl font-semibold mb-4">Tree Counts</h2>
            <div className="w-full h-[400px]">
              <Line key={`tree-${renderKey}`} data={treeData} options={chartOptions} />
            </div>
          </div>

          <div className="glass rounded-xl shadow-xl p-6 bg-slate-800/40 backdrop-blur mb-10">
            <h2 className="text-xl font-semibold mb-4">Planted Area (ha)</h2>
            <div className="w-full h-[400px]">
              <Line key={`area-${renderKey}`} data={hectareData} options={chartOptions} />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-800/50 rounded-xl p-6 overflow-x-auto shadow">
          <table className="min-w-full table-auto text-sm">
            <thead className="border-b border-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Month</th>
                <th className="px-4 py-2">Planned Trees</th>
                <th className="px-4 py-2">Actual Trees</th>
                <th className="px-4 py-2">Planned ha</th>
                <th className="px-4 py-2">Actual ha</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((month, idx) => (
                <tr key={month} className="border-t border-gray-700">
                  <td className="px-4 py-2">{month}</td>
                  <td className="px-4 py-2 text-center">{plannedTrees[idx].toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">{actualTrees[idx].toLocaleString()}</td>
                  <td className="px-4 py-2 text-center">{plannedHectares[idx].toFixed(2)} ha</td>
                  <td className="px-4 py-2 text-center">{actualHectares[idx].toFixed(2)} ha</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Project1MonthlyData;
