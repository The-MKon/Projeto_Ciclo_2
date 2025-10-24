import { SlidersHorizontal, ClipboardList, TrendingUp } from 'lucide-react';

const ModelDeepDive = ({ models }) => {
  if (!models) return null;

  const modelList = Object.entries(models).map(([key, value]) => ({
    name: key,
    ...value
  }));

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-6 border border-slate-200 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-lg">
        <SlidersHorizontal className="w-5 h-5 text-slate-600" />
        Análise Técnica dos Modelos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modelList.map(model => (
          <div key={model.name} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h4 className="font-bold text-lg text-indigo-700">{model.name.replace('Target', 'Target ')}</h4>
            <p className="text-sm text-slate-500 mb-4">{model.nome_modelo} <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">{model.versao}</span></p>

            {/* Hyperparameters */}
            <div className='mb-3'>
              <p className="font-semibold text-slate-600 text-xs uppercase mb-2">Parâmetros</p>
              <div className="text-xs space-y-1 bg-slate-50 p-2 rounded-md">
                {Object.entries(model.parametros).map(([param, value]) => (
                  <div key={param} className="flex justify-between">
                    <span className="text-slate-500">{param.replace('model__', '')}:</span>
                    <span className="font-mono bg-slate-200 px-1 rounded">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Selection */}
            <div className='mb-3'>
              <p className="font-semibold text-slate-600 text-xs uppercase mb-2">Seleção de Features</p>
              <div className="text-sm space-y-1 bg-slate-50 p-2 rounded-md">
                 <div className="flex justify-between items-center">
                    <span className="text-slate-500">Originais:</span>
                    <span className="font-semibold">{model.features_originais}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-slate-500">Utilizadas:</span>
                    <span className="font-semibold">{model.total_features}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-green-600">Redução:</span>
                    <span className="font-semibold text-green-600">{model.reducao_features.toFixed(2)}%</span>
                </div>
              </div>
            </div>
            
            {/* Metrics Table */}
            <div>
              <p className="font-semibold text-slate-600 text-xs uppercase mb-2">Métricas Comparativas</p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="p-2 text-left font-medium text-slate-600">Métrica</th>
                    <th className="p-2 text-center font-medium text-slate-600">Treino</th>
                    <th className="p-2 text-center font-medium text-slate-600">Teste</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {['r2', 'rmse', 'mae', 'mape'].map(metric => (
                        <tr key={metric}>
                            <td className="p-2 font-medium text-slate-500">{metric.toUpperCase()}</td>
                            <td className="p-2 text-center font-mono">{model.metricas_treino[metric]?.toFixed(2) ?? 'N/A'}</td>
                            <td className="p-2 text-center font-mono font-bold text-indigo-700">{model.metricas_teste[metric]?.toFixed(2) ?? 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelDeepDive;