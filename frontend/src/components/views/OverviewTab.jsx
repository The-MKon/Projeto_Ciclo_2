import ModelAccuracy from '../features/overview/ModelAccuracy';
import AccuracyBarChart from '../features/overview/AccuracyBarChart';
import ModelDetails from '../features/overview/ModelDetails';
import FeatureEngineeringCard from '../features/overview/FeatureEngineeringCard'; // Importe o novo card

const OverviewTab = ({ apiResponse }) => {
  if (!apiResponse) {
    return <div className="text-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-slate-800">Resumo da Análise</h2>
      </div>
      
      {/* Linha Superior: Acurácia e Gráfico Comparativo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModelAccuracy models={apiResponse.modelos_utilizados} />
        <AccuracyBarChart models={apiResponse.modelos_utilizados} />
      </div>

      {/* Seção do Meio: Detalhes dos Modelos */}
      <ModelDetails models={apiResponse.modelos_utilizados} />

      {/* Seção Inferior: Features (AGORA UNIFICADA) */}
      <FeatureEngineeringCard 
        totalFeatures={apiResponse.total_features}
        // featureList={apiResponse.lista_features}
      />
    </div>
  );
};

export default OverviewTab;