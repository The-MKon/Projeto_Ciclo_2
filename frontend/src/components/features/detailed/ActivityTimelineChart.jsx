import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

const ActivityTimelineChart = ({ data }) => {
  const chartData = useMemo(() => {
    const entriesByDate = data.reduce((acc, item) => {
      // ===== INÍCIO DA CORREÇÃO =====
      // Verifica se o campo de data existe e não é nulo
      if (!item['Data/Hora Último']) {
        return acc; // Pula este item se a data não existir
      }
      // ===== FIM DA CORREÇÃO =====

      const dateStr = item['Data/Hora Último'].split(' ')[0];
      // O backend agora retorna YYYY-MM-DD, então a conversão fica mais simples
      const [year, month, day] = dateStr.split('-');
      // Valida se a data é válida antes de usar
      if (!year || !month || !day) return acc;
      
      const formattedDate = `${year}-${month}-${day}`;
      
      acc[formattedDate] = (acc[formattedDate] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(entriesByDate)
      .map(([date, count]) => ({ date, Jogadores: count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  if (chartData.length === 0) {
    return (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200 shadow-sm text-center">
            <h3 className="font-semibold text-slate-800 mb-2">Atividade de Jogadores ao Longo do Tempo</h3>
            <p className="text-slate-500 mt-4">Nenhum dado de data válido foi encontrado para gerar este gráfico.</p>
        </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4">Atividade de Jogadores ao Longo do Tempo</h3>
      <div className="bg-white rounded-lg h-80 p-4 border border-violet-100 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Jogadores" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityTimelineChart;