import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
}

interface ChartDataSet {
  name: string;
  color: string;
  data: DataPoint[];
}

interface MultiLineChartCardProps {
  title: string;
  subtitle?: string;
  theme?: "light" | "dark";
  data: ChartDataSet[];
}

export const MultiLineChartCard: React.FC<MultiLineChartCardProps> = ({
  title,
  subtitle,
  theme = "light",
  data,
}) => {
  const mergedData = data[0]?.data.map((_, index) => {
    const obj: { name: string; [key: string]: number | string } = {
      name: data[0].data[index].name,
    };

    data.forEach((line) => {
      obj[line.name] = line.data[index]?.value ?? 0;
    });

    return obj;
  }) || [];

  return (
    <div
      className={`rounded-2xl p-6 shadow-lg border border-white/10 backdrop-blur bg-white/5 text-white transition-all duration-500`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.6)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend
            formatter={(value, entry) => (
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 3,
                  backgroundColor: entry.color,
                  marginRight: 8,
                  verticalAlign: "middle",
                }}
              />
            )}
          />
          {data.map((line, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ stroke: line.color, fill: line.color, r: 4 }}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
