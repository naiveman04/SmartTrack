import React, { useState, useEffect } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import Spinner from "./Spinner";

function RadarGraph({ divisionData }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    {
      divisionData && setLoading(false);
    }
  }, [divisionData]);

  return (
    <div className="p-6 w-full h-[450px] md:h-[500px] flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl shadow-lg hover:shadow-xl border border-gray-300 transition-all duration-300">
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="90%" data={divisionData}>
              <PolarGrid stroke="rgba(0, 0, 0, 0.1)" strokeWidth={1.2} />
              <PolarAngleAxis
                dataKey="division"
                tick={{ fill: "#4A148C", fontWeight: "700", fontSize: 14 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 1]} // Since attendance is a ratio (0 to 1)
                tick={{ fill: "#6B46C1", fontSize: 12, fontWeight: "600" }}
                tickLine={{ stroke: "#6B46C1" }}
              />
              <Radar
                name="Average Attendance"
                dataKey="averageAttendance"
                stroke="#6B46C1"
                fill="url(#colorGradient)"
                fillOpacity={0.7}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6B46C1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(107, 70, 193, 0.2)" }}
              />
              <Legend
                wrapperStyle={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#4A148C",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default RadarGraph;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { division, averageAttendance } = payload[0].payload;

    return (
      <div className="bg-purple-900 text-white p-3 rounded-lg shadow-lg border border-purple-700">
        <p className="font-semibold">
          Division: <span className="font-bold">{division}</span>
        </p>
        <p className="text-sm">
          Avg Attendance:{" "}
          <span className="font-bold">
            {(averageAttendance * 100).toFixed(2)}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};
