import React, { useEffect, useState } from 'react';
import { Trees as Tree, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Header from "../components/Header"; 

<Header />



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
        acc.plannedHectares += phase.total_planned_hectares || 0;
        return acc;
      },
      { trees: 0, hectares: 0, plannedHectares: 0 }
    );

    return {
      trees: totals.trees,
      hectares: totals.hectares,
      plannedHectares: totals.plannedHectares,
    };
  };

  const projectTotals = getProjectTotals();
  const projectPercent = Math.min(
    (projectTotals.hectares / projectTotals.plannedHectares) * 100,
    100
  ).toFixed(0);

  const FlipCard = ({ front, back }: { front: React.ReactNode; back: React.ReactNode }) => (
    <div className="group [perspective:1000px] w-full h-full">
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          {front}
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center text-white text-lg font-semibold bg-slate-800/90 rounded-2xl cursor-pointer">
          {back}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-10 bg-slate-900/90">
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
          {/* Project 1 Button */}
          <div className="w-[700px] max-w-[95vw] h-48">
            <FlipCard
              front={
                <div className="relative w-full h-full px-6 py-6 text-white bg-emerald-800/60 backdrop-blur-sm hover:bg-emerald-700/80 rounded-2xl shadow-xl overflow-hidden">
                  <div className="relative z-10 flex flex-col items-center justify-between h-full">
                    <div className="text-4xl font-bold mb-3">Project 1</div>
                    <div className="text-sm font-medium">
                      <div className="text-center mb-1">Planted</div>
                      <div className="flex justify-between w-full text-base gap-6">
                        <span># - {projectTotals.trees.toLocaleString()}</span>
                        <span>area - {projectTotals.hectares.toLocaleString(undefined, { maximumFractionDigits: 2 })} ha</span>
                      </div>
                    </div>
                    <div className="text-xs text-right text-white/70 mt-1">Progress: {projectPercent}%</div>
                  </div>
                </div>
              }
              back={
                <div onClick={() => navigate('/project/1')}>
                  Monthly data and charts
                </div>
              }
            />
          </div>

          {/* Phase Buttons */}
          <div className="flex flex-col md:flex-row gap-8">
            {[1, 2, 3].map((num) => {
              const stats = getPhaseStats(num);
              const percent = Math.min(
                (stats.hectares / stats.plannedHectares) * 100,
                100
              ).toFixed(0);

              return (
                <div key={num} className="w-72 h-48">
                  <FlipCard
                    front={
                      <div className="relative w-full h-full px-6 py-5 text-white bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div className="text-3xl font-bold text-center">Phase {num}</div>
                          <div className="text-sm font-medium">
                            <div className="text-center mb-1">Planted</div>
                            <div className="flex justify-between w-full text-base">
                              <span># - {stats.trees.toLocaleString()}</span>
                              <span>area - {stats.hectares.toLocaleString(undefined, { maximumFractionDigits: 2 })} ha</span>
                            </div>
                          </div>
                          <div className="text-xs text-right text-white/70 mt-1">Progress: {percent}%</div>
                        </div>
                      </div>
                    }
                    back={
                      <div onClick={() => navigate(`/phase/${num}`)}>
                        Monthly data and charts
                      </div>
                    }
                  />
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
