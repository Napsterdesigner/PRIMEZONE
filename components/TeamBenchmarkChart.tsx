
import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell
} from 'recharts';
import { TEAM } from '../constants';
import { Habit } from '../types';

interface TeamBenchmarkChartProps {
  allHabits: Record<string, Habit[]>;
}

const TeamBenchmarkChart: React.FC<TeamBenchmarkChartProps> = ({ allHabits }) => {
  const data = useMemo(() => {
    return TEAM.map(m => {
      const mHabits = allHabits[m.id] || [];
      const score = mHabits.reduce((acc, h) => acc + h.completedDays.length, 0);
      return {
        name: m.name.split(' ')[0],
        score
      };
    });
  }, [allHabits]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}
        />
        <YAxis axisLine={false} tickLine={false} hide />
        <Tooltip 
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          contentStyle={{ backgroundColor: '#151515', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
          itemStyle={{ color: '#a855f7', fontWeight: 'bold' }}
        />
        <Bar 
          dataKey="score" 
          radius={[6, 6, 0, 0]}
          animationDuration={2000}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill="#a855f7" 
              fillOpacity={0.4 + (index / data.length) * 0.6} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TeamBenchmarkChart;
