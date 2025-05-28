
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import dayjs from 'dayjs';

interface MonthlyData {
  month: string;
  planned_trees: number;
  planned_hectares: number;
  actual_trees: number;
  actual_hectares: number;
}

const Project1MonthlyData = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MonthlyData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthList, setMonthList] = useState<string[]>([]);

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
      const queries = await Promise.all(
        phaseTables.map((table) =>
          supabase
            .from(table)
            .select('*')
            .eq('month', dayjs(selectedMonth).format('YYYY-MM-01'))
        )
      );

      const combined = queries
        .flatMap(({ data }) => data || [])
        .reduce(
          (acc, entry) => {
            acc.planned_trees += entry.planned_trees || 0;
            acc.planned_hectares += parseFloat(entry.planned_hectares || 0);
            acc.actual_trees += entry.actual_trees || 0;
            acc.actual_hectares += parseFloat(entry.actual_hectares || 0);
            return acc;
          },
          {
            month: selectedMonth,
            planned_trees: 0,
            planned_hectares: 0,
            actual_trees: 0,
            actual_hectares: 0
          }
        );

      setData([combined]);
    }

    if (selectedMonth) {
      fetchAllData();
    }
  }, [selectedMonth]);

  const stats = data[0];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Project 1 – Monthly Data</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="mb-8">
        <label className="block mb-2 font-medium">Select Month:</label>
        <select
          className="bg-slate-800 border border-slate-700 px-4 py-2 rounded text-white"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthList.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">🌱 Planned</h2>
            <p>Trees: {stats.planned_trees.toLocaleString()}</p>
            <p>Area: {stats.planned_hectares.toFixed(2)} ha</p>
          </div>
          <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">🌿 Actual</h2>
            <p>Trees: {stats.actual_trees.toLocaleString()}</p>
            <p>Area: {stats.actual_hectares.toFixed(2)} ha</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project1MonthlyData;
