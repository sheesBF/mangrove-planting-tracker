import React, { useEffect, useState } from 'react';
import { Trees as Tree, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

interface PhaseTotal {
  phase_name: string;
  total_actual_trees: number;
  total_actual_hectares: number;
}

function Tracking() {
  const navigate = useNavigate();
  const [phaseTotals, setPhaseTotals] = useState<PhaseTotal[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPhaseTotals() {
      try {
        const { data, error } = await supabase
          .from('phase_totals')
          .select('phase_name, total_actual_trees, total_actual_hectares')
          .order('phase_name');

        if (error) {
          console.error('Error fetching phase totals:', error);
          return;
        }

        if (data && data.length > 0) {
          setPhaseTotals(data);
          setActiveTab(data[0].phase_name);
        }
      } catch (error) {
        console.error('Error:', error);
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
            <h1 className="text-xl font-semibold tracking-tight">MozBlue Monitoring</h1>
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

      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mt-24">
          <div className="bg-slate-800/50 rounded-xl backdrop-blur-sm">
            <div className="border-b border-slate-700">
              <div className="flex">
                {phaseTotals.map((phase) => (
                  <button
                    key={phase.phase_name}
                    onClick={() => setActiveTab(phase.phase_name)}
                    className={`px-8 py-4 text-sm font-medium transition-colors relative ${
                      activeTab === phase.phase_name
                        ? 'text-emerald-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {phase.phase_name}
                    {activeTab === phase.phase_name && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8">
              {phaseTotals.map((phase) => (
                <div
                  key={phase.phase_name}
                  className={`space-y-8 ${activeTab === phase.phase_name ? 'block' : 'hidden'}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-medium text-slate-300 mb-2">Total Trees Planted</h3>
                      <p className="text-4xl font-bold text-emerald-400">
                        {phase.total_actual_trees.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-medium text-slate-300 mb-2">Total Hectares Covered</h3>
                      <p className="text-4xl font-bold text-emerald-400">
                        {phase.total_actual_hectares.toLocaleString()} ha
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracking;