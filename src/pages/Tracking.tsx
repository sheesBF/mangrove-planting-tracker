import React, { useEffect, useState } from 'react';
import { Trees as Tree, ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

interface ProjectSummary {
  totalTrees: number;
  totalHectares: number;
}

interface PhaseSummary {
  id: number;
  totalTrees: number;
  totalHectares: number;
}

interface MonthlyData {
  month: string;
  planned_trees: number;
  planned_hectares: number;
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
      // Fetch summaries for each phase
      const phases = [1, 2, 3];
      const phaseData = await Promise.all(
        phases.map(async (phaseNum) => {
          const { data } = await supabase
            .from(`phase${phaseNum}_monthly_data`)
            .select('planned_trees, planned_hectares');

          const totalTrees = data?.reduce((sum, item) => sum + (item.planned_trees || 0), 0) || 0;
          const totalHectares = data?.reduce((sum, item) => sum + (item.planned_hectares || 0), 0) || 0;

          return {
            id: phaseNum,
            totalTrees,
            totalHectares
          };
        })
      );

      setPhaseSummaries(phaseData);

      // Calculate project totals
      const projectTotalTrees = phaseData.reduce((sum, phase) => sum + phase.totalTrees, 0);
      const projectTotalHectares = phaseData.reduce((sum, phase) => sum + phase.totalHectares, 0);

      setProjectSummary({
        totalTrees: projectTotalTrees,
        totalHectares: projectTotalHectares
      });
    }

    fetchSummaries();
  }, []);

  const handlePhaseClick = async (phaseId: number) => {
    setSelectedPhase(phaseId);
    setShowMonths(true);
    
    const { data } = await supabase
      .from(`phase${phaseId}_monthly_data`)
      .select('month, planned_trees, planned_hectares')
      .order('month');
    
    setMonthlyData(data || []);
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
          <div className="flex flex-col items-center gap-12 w-full max-w-5xl">
            {/* Project Button */}
            <button 
              onClick={() => navigate('/project/1')}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 w-full max-w-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Project 1</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white/80">Total Trees: {projectSummary.totalTrees.toLocaleString()}</p>
                    <p className="text-white/80">Total Hectares: {projectSummary.totalHectares.toLocaleString()} ha</p>
                  </div>
                  <Tree className="h-8 w-8 text-white/30" />
                </div>
              </div>
            </button>

            {/* Decorative Line */}
            <div className="w-px h-12 bg-emerald-400/30"></div>

            {/* Phase Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {phaseSummaries.map((phase) => {
                const gradientColors = {
                  1: 'from-blue-500 to-blue-600',
                  2: 'from-emerald-500 to-emerald-600',
                  3: 'from-purple-500 to-purple-600'
                }[phase.id];

                return (
                  <button 
                    key={phase.id}
                    onClick={() => handlePhaseClick(phase.id)}
                    className={`relative group overflow-hidden rounded-xl bg-gradient-to-r ${gradientColors} p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                  >
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-2">Phase {phase.id}</h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white/80 text-sm">Trees: {phase.totalTrees.toLocaleString()}</p>
                          <p className="text-white/80 text-sm">Hectares: {phase.totalHectares.toLocaleString()} ha</p>
                        </div>
                        <Tree className="h-8 w-8 text-white/30" />
                      </div>
                    </div>
                  </button>
                );
              })}
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
                    <p className="text-sm text-white/70">
                      {data.planned_trees.toLocaleString()} trees
                    </p>
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