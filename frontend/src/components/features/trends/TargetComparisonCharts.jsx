import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';

const TargetComparisonCharts = ({ apiResponse }) => {

  const chartData = useMemo(() => {
    const { resultados, estatisticas } = apiResponse;
    if (!resultados || !estatisticas || resultados.length === 0) return null;

    const calculateRealStats = (targetKey) => {
      const values = resultados.map(item => item.dados_processados_completos[targetKey]).filter(v => v !== null && !isNaN(v));
      if (values.length === 0) return { media: 0, min: 0, max: 0 };
      return {
        media: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
      };
    };

    const realStatsT1 = calculateRealStats('Target1');
    const realStatsT2 = calculateRealStats('Target2');
    const realStatsT3 = calculateRealStats('Target3');

    return {
      media: [
        { name: 'Target 1', Real: realStatsT1.media, Previsto: estatisticas.target1_media },
        { name: 'Target 2', Real: realStatsT2.media, Previsto: estatisticas.target2_media },
        { name: 'Target 3', Real: realStatsT3.media, Previsto: estatisticas.target3_media },
      ],
      minimo: [
        { name: 'Target 1', Real: realStatsT1.min, Previsto: estatisticas.target1_min },
        { name: 'Target 2', Real: realStatsT2.min, Previsto: estatisticas.target2_min },
        { name: 'Target 3', Real: realStatsT3.min, Previsto: estatisticas.target3_min },
      ],
      maximo: [
        { name: 'Target 1', Real: realStatsT1.max, Previsto: estatisticas.target1_max },
        { name: 'Target 2', Real: realStatsT2.max, Previsto: estatisticas.target2_max },
        { name: 'Target 3', Real: realStatsT3.max, Previsto: estatisticas.target3_max },
      ]
    };
  }, [apiResponse]);

  if (!chartData) return null;

  const renderBarChart = (data, title) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <h5 className="font-bold text-center text-indigo-700 mb-2">{title}</h5>
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                {/* Eixo Y com escala fixa de 0 a 100 */}
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} unit="%" />
                <Tooltip formatter={(value) => parseFloat(value).toFixed(2)} />
                <Legend />
                <Bar dataKey="Real" fill="#8884d8" />
                <Bar dataKey="Previsto" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );

  return (
    <div className="bg-slate-50 rounded-lg p-6 mt-6">
        <h4 className="font-medium text-slate-700 text-center mb-6 flex items-center justify-center gap-2 text-lg">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            Estatísticas: Valores Reais vs. Previstos
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderBarChart(chartData.media, "Comparativo de Médias")}
            {renderBarChart(chartData.minimo, "Comparativo de Mínimos")}
            {renderBarChart(chartData.maximo, "Comparativo de Máximos")}
        </div>
    </div>
  );
};

export default TargetComparisonCharts;