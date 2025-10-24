import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarDays } from 'lucide-react';

const WeekdayWeekendAnalysis = ({ data }) => {

  const chartData = useMemo(() => {
    if (!data) return [];

    const weekdaysData = [];
    const weekendsData = [];

    data.forEach(item => {
      // ===== INÍCIO DA CORREÇÃO =====
      if (!item['Data/Hora Último']) {
        return; // Pula este item se a data for nula
      }
      // ===== FIM DA CORREÇÃO =====
      
      const dateParts = item['Data/Hora Último'].split(' ')[0].split('-');
      const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendsData.push(item);
      } else {
        weekdaysData.push(item);
      }
    });

    const calculateAverages = (arr) => {
      if (arr.length === 0) return { avg1: 0, avg2: 0, avg3: 0 };
      const total1 = arr.reduce((sum, item) => sum + item.Target1, 0);
      const total2 = arr.reduce((sum, item) => sum + item.Target2, 0);
      const total3 = arr.reduce((sum, item) => sum + item.Target3, 0);
      return {
        avg1: total1 / arr.length,
        avg2: total2 / arr.length,
        avg3: total3 / arr.length,
      };
    };

    const weekdayAvgs = calculateAverages(weekdaysData);
    const weekendAvgs = calculateAverages(weekendsData);

    return [
      {
        name: 'Dias de Semana',
        'Target 1': weekdayAvgs.avg1.toFixed(2),
        'Target 2': weekdayAvgs.avg2.toFixed(2),
        'Target 3': weekdayAvgs.avg3.toFixed(2),
      },
      {
        name: 'Fim de Semana',
        'Target 1': weekendAvgs.avg1.toFixed(2),
        'Target 2': weekendAvgs.avg2.toFixed(2),
        'Target 3': weekendAvgs.avg3.toFixed(2),
      },
    ];
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
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Média do Target (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${parseFloat(value).toFixed(2)}%`} />
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