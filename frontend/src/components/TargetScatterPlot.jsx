import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

const TargetScatterPlot = ({ data }) => {
  // Agrupando dados por cluster para o gráfico de dispersão
  const scatterData = data.reduce((acc, item) => {
    const cluster = `Cluster ${item.Cluster}`;
    if (!acc[cluster]) {
      acc[cluster] = [];
    }
    acc[cluster].push({
      target1: item.Target1,
      target2: item.Target2,
      target3: item.Target3 // Usaremos no Tooltip
    });
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4">Dispersão: Target 1 vs Target 2 por Cluster</h3>
      <div className="bg-white rounded-lg h-96 p-4 border border-emerald-100 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="target1" name="Target 1" unit="%" />
            <YAxis type="number" dataKey="target2" name="Target 2" unit="%" />
            <ZAxis dataKey="target3" range={[60, 400]} name="Target 3" unit="%" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            {Object.entries(scatterData).map(([clusterName, clusterData], index) => (
              <Scatter key={clusterName} name={clusterName} data={clusterData} fill={COLORS[index % COLORS.length]} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TargetScatterPlot;