
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { supabase } from '../services/supabaseClient';
import dayjs from 'dayjs';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Project1MonthlyData = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthList, setMonthList] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [plannedTrees, setPlannedTrees] = useState<number[]>([]);
  const [actualTrees, setActualTrees] = useState<number[]>([]);

  useEffect(() => {
    const months: string[] = [];
    const start = dayjs('2024-11-01');
    const end = dayjs('2026-12-01');
    let current = start;
    while (current.isBefore(end) || current.isSame(end)) {
      months.push(current.format('MMMM YYYY'));
      current = current.add(1, 'month');
    }
    const lastMonth = dayjs().subtract(1, 'month').format('MMMM YYYY');
    setMonthList(months);
    setSelectedMonth(lastMonth);
  }, []);

  useEffect(() => {
    async function fetchAllData() {
      const phaseTables = ['phase1_monthly_data', 'phase2_monthly_data', 'phase3_monthly_data'];
      const months: string[] = [];
      const start = dayjs('2024-11-01');
      const end = dayjs('2026-12-01');
      let current = start;

      const labelList: string[] = [];
      const planned: number[] = [];
      const actual: number[] = [];

      while (current.isBefore(end) || current.isSame(end)) {
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
              return acc;
            },
            { planned_trees: 0, actual_trees: 0 }
          );

        labelList.push(monthLabel);
        planned.push(combined.planned_trees);
        actual.push(combined.actual_trees);

        current = current.add(1, 'month');
      }

      setLabels(labelList);
      setPlannedTrees(planned);
      setActualTrees(actual);
    }

    fetchAllData();
  }, []);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Planned Trees',
        data: plannedTrees,
        fill: false,
        borderColor: 'rgba(255,255,255,0.6)',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Actual Trees',
        data: actualTrees,
        fill: false,
        borderColor: 'rgba(34,197,94,1)',
        backgroundColor: '#ffffff',
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
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

  return (
    <div className="min-h-screen bg-slate-900 animate-bg-pulse text-white font-sans px-6 py-12">
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

      <div className="glass rounded-xl shadow-xl p-6 bg-slate-800/40 backdrop-blur mb-10">
        <h2 className="text-xl font-semibold mb-4">Planned vs Actual Tree Counts</h2>
        <div className="w-full h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Project1MonthlyData;
