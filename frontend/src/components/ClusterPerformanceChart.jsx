import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ClusterPerformanceChart = ({ data }) => {
  const chartData = data.map(cluster => ({
    name: `Cluster ${cluster.Cluster}`,
    'Taxa de Acerto (%)': cluster.Quiz_Taxa_de_Acerto.toFixed(2),
    'Tempo Total (s)': cluster.Quiz_Tempo_Total.toFixed(2)
  }));

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200 shadow-sm">
       <h3 className="font-semibold text-slate-800 mb-4">Métricas por Cluster</h3>
      <div className="bg-white rounded-lg h-72 p-4 border border-cyan-100 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Taxa de Acerto (%)" fill="#8884d8" />
            <Bar dataKey="Tempo Total (s)" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClusterPerformanceChart;