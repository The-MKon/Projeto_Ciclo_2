import { useMemo } from 'react';
import TargetScatterPlot from '../features/trends/TargetScatterPlot'; 
import TargetComparisonCharts from '../features/trends/TargetComparisonCharts';

const TrendsTab = ({ apiResponse }) => {
  const unifiedData = useMemo(() => {
    if (!apiResponse || !apiResponse.resultados) return [];
    return apiResponse.resultados.map(item => ({
      ...item.dados_processados_completos,
    }));
  }, [apiResponse]);

  if (unifiedData.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-slate-800">Correlações e Tendências entre Targets</h2>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Passando uma prop 'color' para cada gráfico */}
          <TargetScatterPlot 
            data={unifiedData} 
            xAxisKey="Target1"
            yAxisKey="Target2"
            title="Target 1 vs Target 2"
            color="#8884d8" // Roxo
          />
          <TargetScatterPlot 
            data={unifiedData} 
            xAxisKey="Target1"
            yAxisKey="Target3"
            title="Target 1 vs Target 3"
            color="#82ca9d" // Verde
          />
          <TargetScatterPlot 
            data={unifiedData} 
            xAxisKey="Target2"
            yAxisKey="Target3"
            title="Target 2 vs Target 3"
            color="#ffc658" // Amarelo/Laranja
          />
        </div>
        
        <TargetComparisonCharts apiResponse={apiResponse} />
      </div>
    </div>
  );
};

export default TrendsTab;