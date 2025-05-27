import React, { useEffect, useState } from 'react';
import { Trees as Tree, ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

interface ProjectSummary {
  totalTrees: number;
  totalHectares: number;
  totalActualTrees: number;
  totalActualHectares: number;
}

interface PhaseSummary {
  id: number;
  totalTrees: number;
  totalHectares: number;
  totalActualTrees: number;
  totalActualHectares: number;
}

interface MonthlyData {
  month: string;
  planned_trees: number;
  planned_hectares: number;
  actual_trees: number;
  actual_hectares: number;
}

function Tracking() {
  const navigate = useNavigate();
  const [projectSummary, setProjectSummary] = useState<ProjectSummary | null>(null);
  const [phaseSummaries, setPhaseSummaries] = useState<PhaseSummary[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [showMonths, setShowMonths] = useState(false);

  useEffect(() => {
    async function fetchSummaries() {
      try {
        // Fetch summaries for each phase
        const phases = [1, 2];  // Only phases 1 and 2 exist in the database
        const phaseData = await Promise.all(
          phases.map(async (phaseNum) => {
            const { data, error } = await supabase
              .from(`phase${phaseNum}_monthly_data`)
              .select('*');

            if (error) {
              console.error(`Error fetching phase ${phaseNum} data:`, error);
              return {
                id: phaseNum,
                totalTrees: 0,
                totalHectares: 0,
                totalActualTrees: 0,
                totalActualHectares: 0
              };
            }

            if (!data) return {
              id: phaseNum,
              totalTrees: 0,
              totalHectares: 0,
              totalActualTrees: 0,
              totalActualHectares: 0
            };

            const totalTrees = data.reduce((sum, item) => sum + (Number(item.planned_trees) || 0), 0);
            const totalHectares = data.reduce((sum, item) => sum + (Number(item.planned_hectares) || 0), 0);
            const totalActualTrees = data.reduce((sum, item) => sum + (Number(item.actual_trees) || 0), 0);
            const totalActualHectares = data.reduce((sum, item) => sum + (Number(item.actual_hectares) || 0), 0);

            console.log(`Phase ${phaseNum} totals:`, {
              totalTrees,
              totalHectares,
              totalActualTrees,
              totalActualHectares
            });

            return {
              id: phaseNum,
              totalTrees,
              totalHectares,
              totalActualTrees,
              totalActualHectares
            };
          })
        );

        setPhaseSummaries(phaseData);

        // Calculate project totals
        const projectTotalTrees = phaseData.reduce((sum, phase) => sum + phase.totalTrees, 0);
        const projectTotalHectares = phaseData.reduce((sum, phase) => sum + phase.totalHectares, 0);
        const projectTotalActualTrees = phaseData.reduce((sum, phase) => sum + phase.totalActualTrees, 0);
        const projectTotalActualHectares = phaseData.reduce((sum, phase) => sum + phase.totalActualHectares, 0);

        setProjectSummary({
          totalTrees: projectTotalTrees,
          totalHectares: projectTotalHectares,
          totalActualTrees: projectTotalActualTrees,
          totalActualHectares: projectTotalActualHectares
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchSummaries();
  }, []);

  const handlePhaseClick = async (phaseId: number) => {
    try {
      setSelectedPhase(phaseId);
      setShowMonths(true);
      
      const { data, error } = await supabase
        .from(`phase${phaseId}_monthly_data`)
        .select('*')
        .order('month');
      
      if (error) {
        console.error('Error fetching monthly data:', error);
        return;
      }

      setMonthlyData(data || []);
    } catch (error) {
      console.error('Error handling phase click:', error);
    }
  };

  const handleMonthClick = (month: string) => {
    if (selectedPhase) {
      navigate(`/phase/${selectedPhase}?month=${month}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (!projectSummary || phaseSummaries.length === 0) {
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
          <div className="flex items-center space-x-4">
            {showMonths && (
              <button
                onClick={() => setShowMonths(false)}
                className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Phases</span>
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        {!showMonths ? (
          <div className="w-full max-w-4xl mt-24">
            <div className="bg-slate-800/50 rounded-xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-white/70">Planned Trees</p>
                    <p className="text-3xl font-bold text-emerald-400">{projectSummary.totalTrees.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Actual Trees</p>
                    <p className="text-3xl font-bold text-amber-400">{projectSummary.totalActualTrees.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-white/70">Planned Hectares</p>
                    <p className="text-3xl font-bold text-emerald-400">{projectSummary.totalHectares.toLocaleString()} ha</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Actual Hectares</p>
                    <p className="text-3xl font-bold text-amber-400">{projectSummary.totalActualHectares.toLocaleString()} ha</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {phaseSummaries.map((phase) => (
                  <div 
                    key={phase.id}
                    onClick={() => handlePhaseClick(phase.id)}
                    className="bg-slate-700/30 rounded-lg p-6 hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <h3 className="text-xl font-semibold mb-4">Phase {phase.id}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="mb-3">
                          <p className="text-sm text-white/70">Planned Trees</p>
                          <p className="text-lg font-medium text-emerald-400">{phase.totalTrees.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/70">Actual Trees</p>
                          <p className="text-lg font-medium text-amber-400">{phase.totalActualTrees.toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <div className="mb-3">
                          <p className="text-sm text-white/70">Planned Hectares</p>
                          <p className="text-lg font-medium text-emerald-400">{phase.totalHectares.toLocaleString()} ha</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/70">Actual Hectares</p>
                          <p className="text-lg font-medium text-amber-400">{phase.totalActualHectares.toLocaleString()} ha</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl mt-24">
            <h2 className="text-2xl font-bold mb-6">Select Month for Phase {selectedPhase}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {monthlyData.map((data) => (
                <button
                  key={data.month}
                  onClick={() => handleMonthClick(data.month)}
                  className="flex items-center space-x-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                >
                  <Calendar className="h-5 w-5 text-emerald-400" />
                  <div className="text-left">
                    <p className="font-medium">{formatDate(data.month)}</p>
                    <div className="text-sm">
                      <p className="text-emerald-400">Planned: {data.planned_trees.toLocaleString()} trees</p>
                      <p className="text-amber-400">Actual: {(data.actual_trees || 0).toLocaleString()} trees</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tracking;