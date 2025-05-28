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
      const { data, error } = await supabase
        .from('phase_totals')
        .select('*')
        .order('phase_name');

      if (error) {
        console.error('Error fetching phase totals:', error);
      } else {
        setPhaseTotals(data || []);
      }

      setIsLoading(false);
    }

    fetchPhaseTotals();
  }, []);

  const getPhaseStats = (phaseNum: number) => {
    const phase = phaseTotals.find((p) =>
      p.phase_name?.toLowerCase().includes(`phase ${phaseNum}`)
    );

    return {
      trees: phase?.total_actual_trees ?? 0,
      hectares: phase?.total_actual_hectares ?? 0,
      plannedHectares: phase?.total_planned_hectares ?? 1,
    };
  };

  const getProjectTotals = () => {
    const totals = phaseTotals.reduce(
      (acc, phase) => {
        acc.trees += phase.total_actual_trees || 0;
        acc.hectares += phase.total_actual_hectares || 0;
        return acc;
      },
      { trees: 0, hectares: 0 }
    );

    return {
      trees: totals.trees,
      hectares: totals.hectares,
    };
  };

  const projectTotals = getProjectTotals();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
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

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen pt-20 gap-12">
          {/* Project Button */}
          <button
            onClick={() => navigate('/project/1')}
            className="w-[700px] max-w-[95vw] px-10 py-8 text-white bg-sky-500/80 backdrop-blur-sm hover:bg-sky-400/90 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
          >
            <div className="text-4xl font-bold mb-3">Project 1</div>
            <div className="text-base font-medium space-y-1">
              <p>Total Planted: {projectTotals.trees.toLocaleString()}</p>
              <p>Total Planted ha: {projectTotals.hectares.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
          </button>

          {/* Phase Buttons */}
          <div className="flex flex-col md:flex-row gap-8">
            {[1, 2, 3].map((num) => {
              const stats = getPhaseStats(num);
              const percent = Math.min(
                (stats.hectares / stats.plannedHectares) * 100,
                100
              ).toFixed(0);

              return (
                <div
                  key={num}
                  className="relative w-72 h-48 px-6 py-5 text-white bg-emerald-600/40 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105"
                >
                  {/* Liquid fill layer */}
                  <div
                    className="absolute bottom-0 left-0 w-full animate-[pulse_3s_infinite] z-0"
                    style={{
                      height: `${percent}%`,
                      background: `radial-gradient(circle at 50% 120%, rgba(52, 211, 153, 0.5) 0%, rgba(16, 185, 129, 0.6) 60%, rgba(5, 150, 105, 0.8) 100%)`,
                      transition: 'height 0.8s ease-in-out',
                    }}
                  />

                  {/* Foreground content */}
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="text-3xl font-bold text-center">Phase {num}</div>

                    <div className="text-sm font-medium">
                      <div className="text-center mb-1">Planted</div>
                      <div className="flex justify-between w-full text-base">
                        <span># - {stats.trees.toLocaleString()}</span>
                        <span>
                          ha - {stats.hectares.toLocaleString(undefined, { maximumFractionDigits: 2 })} ha
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-right text-white/70 mt-1">Progress: {percent}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tracking;
