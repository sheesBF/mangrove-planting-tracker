
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../hooks/useTheme";
import { useState } from "react";

interface MultiLineChartCardProps {
  title: string;
  data: {
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string }[];
  };
}

const MultiLineChartCard = ({ title, data }: MultiLineChartCardProps) => {
  const { theme } = useTheme();
  const [visibleLines, setVisibleLines] = useState(() =>
    Object.fromEntries(data.datasets.map((ds) => [ds.label, true]))
  );

  const toggleLine = (label: string) => {
    setVisibleLines((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const chartData = data.labels.map((label, i) => {
    const row: any = { name: label };
    data.datasets.forEach((ds) => {
      row[ds.label] = ds.data[i];
    });
    return row;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card animated-background ${theme === "light" ? "bg-white/80 border-slate-200" : ""} p-6 h-[300px]`}
    >
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="name" tick={{ fill: "#ccc", fontSize: 12 }} />
          <YAxis tick={{ fill: "#ccc", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          <Legend
            content={({ payload }) => (
              <ul className="flex gap-4 text-sm mt-2">
                {payload?.map((entry, index) => (
                  <li
                    key={`legend-${index}`}
                    onClick={() => toggleLine(entry.value)}
                    className={`flex items-center gap-2 cursor-pointer ${
                      visibleLines[entry.value] ? "" : "opacity-40"
                    }`}
                  >
                    <svg width="24" height="8">
                      <line
                        x1="0"
                        y1="4"
                        x2="24"
                        y2="4"
                        stroke={entry.color}
                        strokeWidth="2"
                      />
                    </svg>
                    <span>{entry.value}</span>
                  </li>
                ))}
              </ul>
            )}
          />
          {data.datasets.map(
            (ds) =>
              visibleLines[ds.label] && (
                <Line
                  key={ds.label}
                  type="monotone"
                  dataKey={ds.label}
                  stroke={ds.borderColor}
                  strokeWidth={2}
                  dot={{ stroke: ds.borderColor, strokeWidth: 2 }}
                />
              )
          )}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default MultiLineChartCard;
