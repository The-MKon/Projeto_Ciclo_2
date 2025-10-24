import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Cores para os Targets, para manter a consistência
const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const ErrorMetricChart = ({ title, data, dataKey, unit = '' }) => {
  return (
    <div className="h-48"> {/* Altura fixa para o container do gráfico */}
      <p className="text-center text-sm font-medium text-slate-600 mb-2">{title}</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(tick) => `${tick}${unit}`} tick={{ fontSize: 10 }}/>
          <Tooltip 
            cursor={{ fill: 'rgba(238, 242, 255, 0.6)' }}
            formatter={(value) => `${parseFloat(value).toFixed(2)}${unit}`} 
          />
          <Bar dataKey={dataKey}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ErrorMetricChart;