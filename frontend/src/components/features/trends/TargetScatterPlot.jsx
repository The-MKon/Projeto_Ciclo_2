import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TargetScatterPlot = ({ data, xAxisKey, yAxisKey, title, color = '#8884d8' }) => {
  const scatterData = data.map(item => ({
    x: item[xAxisKey],
    y: item[yAxisKey],
  }));

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
      <h4 className="font-medium text-slate-700 text-center mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name={xAxisKey} unit="%" domain={[0, 100]}/>
          <YAxis type="number" dataKey="y" name={yAxisKey} unit="%" domain={[0, 100]}/>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          {/* A propriedade 'fill' agora usa a cor passada como prop */}
          <Scatter name="Jogadores" data={scatterData} fill={color} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TargetScatterPlot;