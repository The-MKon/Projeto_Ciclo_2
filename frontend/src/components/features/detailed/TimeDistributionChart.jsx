import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Clock } from 'lucide-react';

const TimeDistributionChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    const times = data.map(item => item.Tempo_Total).filter(t => t !== null && !isNaN(t));
    if (times.length === 0) return [];
    
    const maxTime = Math.max(...times);
    const binSize = Math.ceil(maxTime / 10 / 10) * 10; // Arredonda o tamanho do bin para a dezena mais próxima
    const bins = {};

    times.forEach(time => {
      const binIndex = Math.floor(time / binSize);
      const binName = `${binIndex * binSize}s - ${(binIndex + 1) * binSize}s`;
      bins[binName] = (bins[binName] || 0) + 1;
    });

    return Object.entries(bins).map(([name, count]) => ({ name, Jogadores: count }));
  }, [data]);

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
      <h4 className="font-medium text-slate-700 text-center mb-4 flex items-center justify-center gap-2">
        <Clock className="w-5 h-5 text-indigo-600" />
        Distribuição do Tempo Total
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }}/>
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Jogadores" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeDistributionChart;