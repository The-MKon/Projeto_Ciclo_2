import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BrainCircuit } from 'lucide-react';

const BehavioralAnalysisChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    // Filtra apenas os itens que têm dados válidos para as duas métricas
    return data
      .filter(item => item.Eficiencia_Performance != null && item.Atitude_Consistente != null)
      .map(item => ({
        x: item.Eficiencia_Performance,
        y: item.Atitude_Consistente,
      }));
  }, [data]);

  if (chartData.length === 0) {
    return null; // Não renderiza se não houver dados
  }

  return (
    <div className="bg-gradient-to-br from-lime-50 to-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-green-600" />
        Análise Comportamental: Eficiência vs. Consistência
      </h3>
      <div className="bg-white rounded-lg h-96 p-4 border border-green-100 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Eficiência de Performance" 
              tickFormatter={(tick) => tick.toFixed(2)} 
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Atitude Consistente" 
              tickFormatter={(tick) => tick.toFixed(1)} 
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              formatter={(value, name) => [value.toFixed(3), name]}
            />
            <Legend />
            <Scatter name="Jogadores" data={chartData} fill="#22c55e" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BehavioralAnalysisChart;