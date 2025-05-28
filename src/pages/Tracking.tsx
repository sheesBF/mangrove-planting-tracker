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
        console.log('Fetched phase_totals:', data);
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

    const stats = {
      trees: phase?.total_actual_trees ?? 0,
      hectares: phase?.total_actual_hectares ?? 0,
    };

    console.log('Matching Phase:', phaseNum, '→', phase?.phase_name, stats);
    return stats;
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

      {/* Wait for data */}
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen pt-20 gap-8">
          {/* Project Button with totals */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => navigate('/project/1')}
              className="w-[624px] max-w-[90vw] h-24 text-3xl font-bold bg-sky-500 hover:bg-sky-400 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Project 1
            </button>
            <div className="mt-2 text-white text-center text-sm">
              <p>
                Total Planted:{' '}
                <span className="font-semibold">
                  {getProjectTotals().trees.toLocaleString()}
                </span>
              </p>
              <p>
                Total Planted ha:{' '}
                <span className="font-semibold">
                  {getProjectTotals().hectares.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </div>

          {/* Phase Buttons */}
          <div className="flex flex-col md:flex-row gap-6">
            {[1, 2, 3].map((num) => {
              const stats = getPhaseStats(num);
              return (
                <button
                  key={num}
                  onClick={() => navigate(`/phase/${num}`)}
                  className="w-60 h-32 p-4 text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex flex-col justify-between text-left"
                >
                  <div className="text-2xl font-bold">Phase {num}</div>
                  <div className="text-sm">
                    <p>
                      Planted:{' '}
                      <span className="font-medium">
                        {stats.trees.toLocaleString()}
                      </span>
                    </p>
                    <p>
                      Planted ha:{' '}
                      <span className="font-medium">
                        {stats.hectares.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tracking;
