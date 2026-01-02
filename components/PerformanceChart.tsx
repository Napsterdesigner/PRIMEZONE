
import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Habit } from '../types';

interface PerformanceChartProps {
  habits: Habit[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ habits }) => {
  const data = useMemo(() => {
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const count = habits.filter(h => h.completedDays.includes(str)).length;
      chartData.push({
        name: d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase(),
        value: count,
      });
    }
    return chartData;
  }, [habits]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 800 }}
          dy={10}
        />
        <YAxis hide domain={[0, 'auto']} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#151515', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
          itemStyle={{ color: '#a855f7', fontWeight: 'bold' }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#a855f7" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorValue)" 
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
