import React from 'react';
import { Trees as Tree, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ProjectDetails() {
  const navigate = useNavigate();

  const projectData = {
    totalTrees: 15000,
    species: [
      { name: "Ceriops tagal", trees: 4000 },
      { name: "Rhizophora mucronata", trees: 4500 },
      { name: "Avicennia marina", trees: 3500 },
      { name: "Bruguiera gymnorrhiza", trees: 3000 }
    ],
    phases: [
      { id: 1, trees: 5000 },
      { id: 2, trees: 6000 },
      { id: 3, trees: 4000 },
    ]
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tree className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-semibold tracking-tight">Project 1 Details</h1>
          </div>
          <button
            onClick={() => navigate('/tracking')}
            className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tracking</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24">
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
          <div className="mb-8">
            <div className="bg-slate-700/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Total Trees Planted</h3>
              <p className="text-4xl font-bold text-emerald-400">{projectData.totalTrees.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="overflow-x-auto">
              <h3 className="text-xl font-semibold mb-4">Species Distribution</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-6">Species</th>
                    <th className="text-right py-4 px-6">Trees Planted</th>
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
                    <th className="text-right py-4 px-6">Trees Planted</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.phases.map((phase) => (
                    <tr key={phase.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                      <td className="py-4 px-6">Phase {phase.id}</td>
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