import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Star } from 'lucide-react';

const PerformanceDistributionChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    const scores = data.map(item => item.Performance_Score_Total).filter(s => s !== null && !isNaN(s));
    if (scores.length === 0) return [];
    
    const binSize = 20; // Agrupar de 20 em 20 pontos
    const bins = {};

    scores.forEach(score => {
      const binIndex = Math.floor(score / binSize);
      const binName = `${binIndex * binSize}-${(binIndex + 1) * binSize}`;
      bins[binName] = (bins[binName] || 0) + 1;
    });

    return Object.entries(bins).map(([name, count]) => ({ name, Jogadores: count }));
  }, [data]);

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
      <h4 className="font-medium text-slate-700 text-center mb-4 flex items-center justify-center gap-2">
        <Star className="w-5 h-5 text-amber-500" />
        Distribuição da Pontuação Total
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Jogadores" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceDistributionChart;