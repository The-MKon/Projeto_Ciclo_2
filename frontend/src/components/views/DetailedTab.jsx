import { useMemo } from 'react';
import ActivityTimelineChart from '../features/detailed/ActivityTimelineChart';
import WeekdayWeekendAnalysis from '../features/detailed/WeekdayWeekendAnalysis';
import ModelDeepDive from '../features/detailed/ModelDeepDive';
import TimeAnalysisBoxPlot from '../features/detailed/TimeAnalysisBoxPlot';
import TimeDistributionChart from '../features/detailed/TimeDistributionChart'; // Importe
import PerformanceDistributionChart from '../features/detailed/PerformanceDistributionChart'; // Importe
import TimeoutProportionChart from '../features/detailed/TimeoutProportionChart'; // Importe
import BehavioralAnalysisChart from '../features/detailed/BehavioralAnalysisChart';

const DetailedTab = ({ apiResponse }) => {
  const unifiedData = useMemo(() => {
    if (!apiResponse || !apiResponse.resultados) return [];
    return apiResponse.resultados.map(item => ({
      ...item.dados_processados_completos,
      ...item.previsoes,
    }));
  }, [apiResponse]);

  if (!apiResponse) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-slate-800">Análises Detalhadas</h2>
      </div>

      {/* Seção de Análise Temporal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityTimelineChart data={unifiedData} />
        <WeekdayWeekendAnalysis data={unifiedData} />
      </div>
      
      {/* Seção de Deep Dive dos Modelos */}
      <ModelDeepDive models={apiResponse.modelos_utilizados} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeAnalysisBoxPlot data={unifiedData} />
        <BehavioralAnalysisChart data={unifiedData} />
      </div>
      
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 text-lg">
            Métricas de Sessão dos Jogadores
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TimeDistributionChart data={unifiedData} />
            <PerformanceDistributionChart data={unifiedData} />
            <TimeoutProportionChart data={unifiedData} />
        </div>
      </div>

    </div>
  );
};

export default DetailedTab;