import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { format, parseISO, subMonths } from "date-fns";
import MultiLineChartCard from "../components/MultiLineChartCard";
import { BackgroundEffects } from "../components/BackgroundEffects";

interface MonthlyData {
  month: string;
  planned_trees: number | null;
  planned_hectares: number | null;
  actual_trees: number | null;
  actual_hectares: number | null;
}

const Project1MonthlyData = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("project1_monthly_data")
        .select("*")
        .order("month");

      if (error) {
        console.error("Error fetching monthly data:", error);
      } else {
        const now = new Date();
        const prevMonth = subMonths(now, 1);
        const filtered = data.filter((entry) => new Date(entry.month) <= prevMonth);
        setData(filtered);
      }
    }

    fetchData();
  }, []);

  const months = data.map((d) => format(parseISO(d.month), "MMM yyyy"));
  const plannedTrees = data.map((d) => d.planned_trees ?? 0);
  const actualTrees = data.map((d) => d.actual_trees ?? 0);
  const plannedHectares = data.map((d) => d.planned_hectares ?? 0);
  const actualHectares = data.map((d) => d.actual_hectares ?? 0);

  return (
    <div className="relative min-h-screen text-white font-sans">
      <BackgroundEffects />

      <div className="relative z-10 px-4 py-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Project 1 – Monthly Data</h1>

        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => setShowChart(true)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              showChart ? "bg-emerald-500 text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Show Chart
          </button>
          <button
            onClick={() => setShowChart(false)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              !showChart ? "bg-emerald-500 text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Show Table
          </button>
        </div>

        {showChart ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MultiLineChartCard
              title="Planted Trees Over Time"
              subtitle="Cumulative count"
              theme="dark"
              data={[
                {
                  name: "Planned Trees",
                  color: "#34d399",
                  data: months.map((month, i) => ({
                    name: month,
                    value: plannedTrees[i] || 0
                  }))
                },
                {
                  name: "Actual Trees",
                  color: "#fbbf24",
                  data: months.map((month, i) => ({
                    name: month,
                    value: actualTrees[i] || 0
                  }))
                }
              ]}
            />
            
            <MultiLineChartCard
              title="Planted Area (ha) Over Time"
              subtitle="Cumulative area"
              theme="dark"
              data={[
                {
                  name: "Planned Area",
                  color: "#3b82f6",
                  data: months.map((month, i) => ({
                    name: month,
                    value: plannedHectares[i] || 0
                  }))
                },
                {
                  name: "Actual Area",
                  color: "#f472b6",
                  data: months.map((month, i) => ({
                    name: month,
                    value: actualHectares[i] || 0
                  }))
                }
              ]}
            />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white/5 backdrop-blur p-4 shadow-lg border border-white/10">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-white/70 border-b border-white/10">
                  <th className="py-2 px-4">Month</th>
                  <th className="py-2 px-4">Planned Trees</th>
                  <th className="py-2 px-4">Actual Trees</th>
                  <th className="py-2 px-4">Planned Area (ha)</th>
                  <th className="py-2 px-4">Actual Area (ha)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-4">{format(parseISO(d.month), "MMM yyyy")}</td>
                    <td className="py-2 px-4">{d.planned_trees?.toLocaleString()}</td>
                    <td className="py-2 px-4">{d.actual_trees?.toLocaleString()}</td>
                    <td className="py-2 px-4">{d.planned_hectares?.toFixed(2)}</td>
                    <td className="py-2 px-4">{d.actual_hectares?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Project1MonthlyData;
