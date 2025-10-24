import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimerOff } from 'lucide-react';

const COLORS = ['#82ca9d', '#ef4444']; // Verde para "Não", Vermelho para "Sim"

const TimeoutProportionChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return [{ name: 'Sem Timeout', value: 0 }, { name: 'Com Timeout', value: 0 }];
    
    const timeoutCount = data.filter(item => item.Tem_Timeout === 1).length;
    const noTimeoutCount = data.length - timeoutCount;

    return [
        { name: 'Sem Timeout', value: noTimeoutCount },
        { name: 'Com Timeout', value: timeoutCount },
    ];
  }, [data]);

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
      <h4 className="font-medium text-slate-700 text-center mb-4 flex items-center justify-center gap-2">
        <TimerOff className="w-5 h-5 text-slate-600" />
        Proporção de Timeouts
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} jogadores`, 'Contagem']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeoutProportionChart;