import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import MultiLineChartCard from '../components/MultiLineChartCard';
import { format } from 'date-fns';

interface MonthlyData {
  month: string;
  planned_trees: number;
  actual_trees: number;
  planned_hectares: number;
  actual_hectares: number;
}

const Project1MonthlyData = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [view, setView] = useState<'table' | 'chart'>('table');

  useEffect(() => {
    async function fetchAllPhaseData() {
      const responses = await Promise.all([
        supabase.from('phase1_monthly_data').select('*'),
        supabase.from('phase2_monthly_data').select('*'),
        supabase.from('phase3_monthly_data').select('*')
      ]);

      const combined = responses
        .flatMap(r => r.data || [])
        .filter((entry: any) => new Date(entry.month) <= new Date())
        .map((entry: any) => ({
          month: format(new Date(entry.month), 'yyyy-MM'),
          planned_trees: entry.planned_trees ?? 0,
          actual_trees: entry.actual_trees ?? 0,
          planned_hectares: entry.planned_hectares ?? 0,
          actual_hectares: entry.actual_hectares ?? 0
        }));

      // Merge by month
      const merged: { [key: string]: MonthlyData } = {};
      combined.forEach(entry => {
        if (!merged[entry.month]) {
          merged[entry.month] = { ...entry };
        } else {
          merged[entry.month].planned_trees += entry.planned_trees;
          merged[entry.month].actual_trees += entry.actual_trees;
          merged[entry.month].planned_hectares += entry.planned_hectares;
          merged[entry.month].actual_hectares += entry.actual_hectares;
        }
      });

      const sorted = Object.values(merged).sort((a, b) =>
        a.month.localeCompare(b.month)
      );
      setData(sorted);
    }

    fetchAllPhaseData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-6 flex gap-4 justify-center">
        <button
          onClick={() => setView('table')}
          className={`px-4 py-2 rounded bg-white/10 backdrop-blur-md hover:bg-white/20 transition ${
            view === 'table' ? 'ring-2 ring-white' : ''
          }`}
        >
          Show Table
        </button>
        <button
          onClick={() => setView('chart')}
          className={`px-4 py-2 rounded bg-white/10 backdrop-blur-md hover:bg-white/20 transition ${
            view === 'chart' ? 'ring-2 ring-white' : ''
          }`}
        >
          Show Chart
        </button>
      </div>

      {view === 'chart' ? (
        <div className="space-y-10">
          <MultiLineChartCard
            title="Trees Planted Over Time"
            data={data}
            dataKey="month"
            lines={[
              { dataKey: 'planned_trees', name: 'Planned Trees', stroke: '#4ade80' },
              { dataKey: 'actual_trees', name: 'Actual Trees', stroke: '#facc15' }
            ]}
          />
          <MultiLineChartCard
            title="Area Planted Over Time"
            data={data}
            dataKey="month"
            lines={[
              { dataKey: 'planned_hectares', name: 'Planned Area', stroke: '#60a5fa' },
              { dataKey: 'actual_hectares', name: 'Actual Area', stroke: '#a78bfa' }
            ]}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/10">
                <th className="p-2">Month</th>
                <th className="p-2">Planned Trees</th>
                <th className="p-2">Actual Trees</th>
                <th className="p-2">Planned Area (ha)</th>
                <th className="p-2">Actual Area (ha)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="p-2">{row.month}</td>
                  <td className="p-2">{row.planned_trees.toLocaleString()}</td>
                  <td className="p-2">{row.actual_trees.toLocaleString()}</td>
                  <td className="p-2">{row.planned_hectares.toFixed(2)}</td>
                  <td className="p-2">{row.actual_hectares.toFixed(2)}</td>
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
