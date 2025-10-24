import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarDays } from 'lucide-react';

const CustomXAxisTick = ({ x, y, payload, data }) => {
    const currentData = data.find((d) => d.name === payload.value);
    const count = currentData ? currentData.count : 0;

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
                <tspan x="0" dy="10">{payload.value}</tspan>
                <tspan x="0" dy="15" fill="#999" fontSize="12px">{`(n=${count})`}</tspan>
            </text>
        </g>
    );
};

const WeekdayWeekendAnalysis = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data) return [];

    const weekdaysData = [];
    const weekendsData = [];

    data.forEach((item) => {
      // ===== LÓGICA SIMPLIFICADA E CORRIGIDA =====
      // Agora usamos a coluna 'Fim_de_Semana' que já vem pronta da API.
      // 1 = Fim de semana, 0 = Dia de semana.
      if (item.Fim_de_Semana === 1) {
        weekendsData.push(item);
      } else if (item.Fim_de_Semana === 0) { // Garante que não contamos valores nulos
        weekdaysData.push(item);
      }
      // Não precisamos mais fazer nenhuma manipulação de data aqui.
    });

    const calculateAverages = (arr) => {
      if (arr.length === 0) return { avg1: 0, avg2: 0, avg3: 0, count: 0 };
      const total1 = arr.reduce((sum, item) => sum + (item.Target1 || 0), 0);
      const total2 = arr.reduce((sum, item) => sum + (item.Target2 || 0), 0);
      const total3 = arr.reduce((sum, item) => sum + (item.Target3 || 0), 0);
      return {
        avg1: total1 / arr.length,
        avg2: total2 / arr.length,
        avg3: total3 / arr.length,
        count: arr.length,
      };
    };

    const dataPoints = [];
    
    const weekdayAvgs = calculateAverages(weekdaysData);
    if (weekdayAvgs.count > 0) {
      dataPoints.push({
        name: 'Dias de Semana',
        'Target 1': weekdayAvgs.avg1.toFixed(2),
        'Target 2': weekdayAvgs.avg2.toFixed(2),
        'Target 3': weekdayAvgs.avg3.toFixed(2),
        count: weekdayAvgs.count,
      });
    }

    const weekendAvgs = calculateAverages(weekendsData);
    if (weekendAvgs.count > 0) {
      dataPoints.push({
        name: 'Fim de Semana',
        'Target 1': weekendAvgs.avg1.toFixed(2),
        'Target 2': weekendAvgs.avg2.toFixed(2),
        'Target 3': weekendAvgs.avg3.toFixed(2),
        count: weekendAvgs.count,
      });
    }

    return dataPoints;
  }, [data]);

  return (
    <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl p-6 border border-sky-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-sky-600" />
        Análise: Dias de Semana vs. Fim de Semana
      </h3>
      <div className="bg-white rounded-lg h-80 p-4 border border-sky-100 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={<CustomXAxisTick data={chartData} />} height={40} />
            <YAxis
              label={{
                value: "Média do Target",
                angle: -90,
                position: "insideLeft",
              }}
              unit="%"
            />
            <Tooltip
              formatter={(value) => `${parseFloat(value).toFixed(2)}%`}
            />
            <Legend />
            <Bar dataKey="Target 1" fill="#8884d8" />
            <Bar dataKey="Target 2" fill="#82ca9d" />
            <Bar dataKey="Target 3" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeekdayWeekendAnalysis;