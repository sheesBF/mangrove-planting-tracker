import React, { useEffect, useState } from 'react';
import { Trees as Tree, ArrowLeft, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

interface ProjectData {
  totalTrees: number;
  totalHectares: number;
  phases: { id: string; phase_number: number; trees: number }[];
  species: { name: string; trees: number }[];
}

function ProjectDetails() {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  useEffect(() => {
    async function fetchProjectData() {
      // Join monthly_data with phases using phase_id - updated query format
      const { data: monthlyData, error } = await supabase
        .from('monthly_data')
        .select(`
          planned_trees,
          planned_hectares,
          phases!monthly_data_phase_id_fkey (
            id,
            phase_number
          )
        `)
        .eq('project_id', '11111111-1111-1111-1111-111111111111');

      if (error) {
        console.error('Error fetching monthly data:', error);
        return;
      }

      if (monthlyData) {
        const totalTrees = monthlyData.reduce((sum, item) => sum + (item.planned_trees || 0), 0);
        const totalHectares = monthlyData.reduce((sum, item) => sum + (item.planned_hectares || 0), 0);
        
        // Group by phase and sum trees - updated to use new phases reference
        const phases = monthlyData.reduce((acc, item) => {
          if (!item.phases) return acc;
          const phase = acc.find(p => p.id === item.phases.id);
          if (phase) {
            phase.trees += item.planned_trees || 0;
          } else {
            acc.push({
              id: item.phases.id,
              phase_number: item.phases.phase_number,
              trees: item.planned_trees || 0
            });
          }
          return acc;
        }, [] as { id: string; phase_number: number; trees: number }[]);

        // Fetch species data
        const { data: speciesData } = await supabase
          .from('phase1_species_data')
          .select('species_name, planned_trees')
          .order('species_name');

        const species = speciesData?.map(item => ({
          name: item.species_name,
          trees: item.planned_trees
        })) || [];

        setProjectData({
          totalTrees,
          totalHectares,
          phases: phases.sort((a, b) => a.phase_number - b.phase_number),
          species
        });
      }
    }

    fetchProjectData();
  }, []);

  if (!projectData) {
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
            <h1 className="text-xl font-semibold tracking-tight">Project 1 Details</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/monthly/1')}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors"
            >
              <BarChart className="h-4 w-4" />
              <span>Monthly</span>
            </button>
            <button
              onClick={() => navigate('/tracking')}
              className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tracking</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24">
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-700/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Total Trees Planned</h3>
              <p className="text-4xl font-bold text-emerald-400">{projectData.totalTrees.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Total Area Planned</h3>
              <p className="text-4xl font-bold text-emerald-400">{projectData.totalHectares.toLocaleString()} ha</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="overflow-x-auto">
              <h3 className="text-xl font-semibold mb-4">Species Distribution</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-6">Species</th>
                    <th className="text-right py-4 px-6">Trees Planned</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.species.map((species) => (
                    <tr key={species.name} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                      <td className="py-4 px-6 italic">{species.name}</td>
                      <td className="text-right py-4 px-6">{species.trees.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <h3 className="text-xl font-semibold mb-4">Phase Overview</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-6">Phase</th>
                    <th className="text-right py-4 px-6">Trees Planned</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.phases.map((phase) => (
                    <tr key={phase.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                      <td className="py-4 px-6">Phase {phase.phase_number}</td>
                      <td className="text-right py-4 px-6">{phase.trees.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;