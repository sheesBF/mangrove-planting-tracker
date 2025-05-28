
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import dayjs from 'dayjs';

const PHASE_TABLE = 'phase2_monthly_data';

const Phase2MonthlyData = () => {
  const navigate = useNavigate();
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const generateMonths = () => {
      const result: string[] = [];
      const start = dayjs('2024-11-01');
      const end = dayjs('2026-12-01');
      let current = start;

      while (current.isBefore(end) || current.isSame(end, 'month')) {
        result.push(current.format('YYYY-MM-01'));
        current = current.add(1, 'month');
      }
      setMonths(result);

      const lastMonth = dayjs().subtract(1, 'month').format('YYYY-MM-01');
      setSelectedMonth(lastMonth);
    };

    generateMonths();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchMonthlyData(selectedMonth);
    }
  }, [selectedMonth]);

  const fetchMonthlyData = async (month: string) => {
    const { data, error } = await supabase
      .from(PHASE_TABLE)
      .select('*')
      .eq('month', month)
      .single();

    if (error) {
      console.error('Error fetching data:', error);
      setData(null);
    } else {
      setData(data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-montserrat px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Phase 2 – Monthly Data</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="mb-8">
        <label htmlFor="month" className="block text-sm font-medium text-slate-300 mb-2">
          Select Month:
        </label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-slate-800 text-white rounded-md px-4 py-2"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {dayjs(m).format('MMMM YYYY')}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📋 Planned</h2>
          <p className="text-sm mb-2">Number of Trees:</p>
          <p className="text-lg font-bold">
            {data?.planned_trees?.toLocaleString() ?? 'N/A'}
          </p>
          <p className="text-sm mt-4 mb-2">Area (ha):</p>
          <p className="text-lg font-bold">
            {data?.planned_hectares?.toFixed(2) ?? 'N/A'}
          </p>
        </div>

        <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">🌿 Actual</h2>
          <p className="text-sm mb-2">Number of Trees:</p>
          <p className="text-lg font-bold">
            {data?.actual_trees?.toLocaleString() ?? 'N/A'}
          </p>
          <p className="text-sm mt-4 mb-2">Area (ha):</p>
          <p className="text-lg font-bold">
            {data?.actual_hectares?.toFixed(2) ?? 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Phase2MonthlyData;
