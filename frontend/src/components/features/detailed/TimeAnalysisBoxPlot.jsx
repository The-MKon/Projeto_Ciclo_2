import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

const TimeAnalysisBoxPlot = ({ data }) => {

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const gameTimes = data.map(item => item.GameTempoTotal).filter(t => !isNaN(t));
    const quizTimes = data.map(item => item.TempoTotal).filter(t => !isNaN(t));

    const calculateStats = (arr) => {
      if (arr.length === 0) return 0;
      return arr.reduce((a, b) => a + b, 0) / arr.length;
    };

    return [
      { name: 'Tempo Médio de Jogo', segundos: calculateStats(gameTimes).toFixed(2) },
      { name: 'Tempo Médio de Questionário', segundos: calculateStats(quizTimes).toFixed(2) },
    ];
  }, [data]);

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-600" />
        Análise de Tempo Gasto (Médias)
      </h3>
      <div className="bg-white rounded-lg h-80 p-4 border border-cyan-100 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" unit="s" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip formatter={(value) => `${parseFloat(value).toFixed(2)} segundos`} />
            <Bar dataKey="segundos" name="Tempo Médio" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeAnalysisBoxPlot;