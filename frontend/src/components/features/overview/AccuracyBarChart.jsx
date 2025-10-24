import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMemo } from 'react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const AccuracyBarChart = ({ models }) => {
  const chartData = useMemo(() => {
    if (!models) return [];
    return Object.entries(models).map(([key, value]) => ({
      name: key.replace('Target', 'T'), // Nomes mais curtos para o eixo X
      r2: parseFloat((value.metricas_teste?.r2 * 100 || 0).toFixed(2))
    }));
  }, [models]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-indigo-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4">Comparativo Visual (R²)</h3>
      <div className="bg-white rounded-lg h-64 p-4 border border-indigo-100 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="%" domain={[0, 100]} />
            <Tooltip 
              cursor={{fill: 'rgba(238, 242, 255, 0.6)'}} 
              formatter={(value) => `${value}%`} 
            />
            <Bar dataKey="r2" name="Acurácia R²">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccuracyBarChart;