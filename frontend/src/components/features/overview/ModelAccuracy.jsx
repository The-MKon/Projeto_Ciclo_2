import { CheckCircle } from 'lucide-react';

const ModelAccuracy = ({ models }) => {
  if (!models) {
    return null;
  }
  
  const modelList = Object.entries(models).map(([key, value]) => ({
    name: key.replace('Target', 'Target '),
    r2: value.metricas_teste?.r2 || 0,
    algoritmo: value.nome_modelo || 'N/A'
  }));

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-indigo-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-indigo-600" />
        Acurácia dos Modelos (R² de Teste)
      </h3>
      <div className="bg-white rounded-lg p-4 border border-indigo-100 shadow-inner space-y-4 h-64 overflow-y-auto">
        {modelList.map((model) => (
          <div key={model.name}>
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-700">{model.name}</span>
              <span className="font-bold text-xl text-indigo-600">
                {(model.r2 * 100).toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Algoritmo: <span className="font-medium">{model.algoritmo}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelAccuracy;