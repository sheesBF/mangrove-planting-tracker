import React, { useEffect, useState } from 'react';
import { Trees as Tree, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

interface PhaseTotal {
  phase_name: string;
  total_planned_trees: number;
  total_planned_hectares: number;
  total_actual_trees: number;
  total_actual_hectares: number;
}

function Tracking() {
  const navigate = useNavigate();
  const [phaseTotals, setPhaseTotals] = useState<PhaseTotal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPhaseTotals() {
      try {
        const { data, error } = await supabase
          .from('phase_totals')
          .select('*')
          .order('phase_name');

        if (error) throw error;
        setPhaseTotals(data || []);
      } catch (error) {
        console.error('Error fetching phase totals:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhaseTotals();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tree className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-semibold tracking-tight">Mangrove Planting Tracker</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Phase buttons */}
      <div className="flex items-center justify-center pt-32 pb-12">
  <div className="flex flex-col md:flex-row gap-6">
    {[1, 2, 3].map((num) => (
      <button
        key={num}
        onClick={() => navigate(`/phase/${num}`)}
        className="w-48 h-20 text-2xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Phase {num}
      </button>
    ))}
  </div>
</div>

      {/* Phase total cards */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid gap-6">
          {phaseTotals.map((phase) => (
            <div
              key={phase.phase_name}
              className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer"
              onClick={() => {
                const parts = phase.phase_name?.split(' ');
                if (parts?.length > 1) navigate(`/phase/${parts[1]}`);
              }}
            >
              <h3 className="text-xl font-semibold mb-4">{phase.phase_name}</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-3">
                    <p className="text-sm text-white/70">Planned Trees</p>
                    <p className="text-lg font-medium text-emerald-400">
                      {phase.total_planned_trees.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Actual Trees</p>
                    <p className="text-lg font-medium text-amber-400">
                      {phase.total_actual_trees.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="mb-3">
                    <p className="text-sm text-white/70">Planned Hectares</p>
                    <p className="text-lg font-medium text-emerald-400">
                      {phase.total_planned_hectares.toLocaleString()} ha
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Actual Hectares</p>
                    <p className="text-lg font-medium text-amber-400">
                      {phase.total_actual_hectares.toLocaleString()} ha
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tracking;
