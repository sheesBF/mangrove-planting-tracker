
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MonthlyData = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Phase {id} - Monthly Data</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg text-white">
        <p className="text-lg">📊 Chart and monthly planting details for Phase {id} will go here.</p>
        {/* Future: Add chart and Supabase queries for actual data */}
      </div>
    </div>
  );
};

export default MonthlyData;
