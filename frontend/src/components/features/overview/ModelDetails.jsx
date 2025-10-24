import { useMemo } from 'react';
import { SlidersHorizontal, AlertCircle, TrendingUp, Target } from 'lucide-react';
import ErrorMetricChart from './ErrorMetricChart'; // Importe o novo componente

const getOverfittingStatusStyle = (status) => {
    // ... (função de estilo inalterada) ...
    switch (status?.toLowerCase()) {
        case 'perfeito':
        case 'excelente':
        case 'excellent':
        case 'good':
            return 'bg-green-100 text-green-800';
        case 'bom':
        case 'moderate':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-red-100 text-red-800';
    }
}

const ModelDetails = ({ models }) => {
    const modelList = useMemo(() => {
        if (!models) return [];
        return Object.entries(models).map(([key, value]) => ({
            name: key.replace('Target', 'Target '),
            ...value
        }));
    }, [models]);

    // Prepara os dados para os gráficos de erro uma única vez
    const maeData = useMemo(() => modelList.map(m => ({ name: m.name, mae: m.metricas_teste?.mae ?? 0 })), [modelList]);
    const mapeData = useMemo(() => modelList.map(m => ({ name: m.name, mape: m.metricas_teste?.mape ?? 0 })), [modelList]);

    return (
        <>
            {/* Card para os Detalhes do Modelo */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-slate-600" />
                    Detalhes dos Modelos de Previsão
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {modelList.map(model => (
                        <div key={model.name} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-lg text-slate-800">{model.name}</h4>
                                <p className="text-sm text-slate-500 mb-4">{model.nome_modelo} <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">{model.versao}</span></p>
                                
                                <div className="space-y-3 text-sm">
                                    <div className="p-2 bg-slate-50 rounded-md">
                                        <p className="font-semibold text-slate-600 text-xs uppercase mb-2">Acurácia (R²)</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 flex items-center gap-1"><TrendingUp className="w-4 h-4 text-green-500"/> Treino:</span>
                                            <span className="font-medium">{(model.metricas_treino.r2 * 100).toFixed(2)}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 flex items-center gap-1"><TrendingUp className="w-4 h-4 text-blue-500"/> Teste:</span>
                                            <span className="font-medium">{(model.metricas_teste.r2 * 100).toFixed(2)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <p className="font-semibold text-slate-600 text-xs uppercase mb-2 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4 text-yellow-500"/>
                                Gap de Overfitting
                                </p>
                                <div className={`p-2 rounded-md text-sm ${getOverfittingStatusStyle(model.overfitting.status)}`}>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Diferença R²:</span>
                                        <span className="font-bold">{(model.overfitting.diferenca_r2 * 100).toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Novo Card para os Gráficos de Erro */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200 shadow-sm">
                 <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-600" />
                    Comparativo de Erro Médio (Teste)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ErrorMetricChart title="MAE (Erro Absoluto)" data={maeData} dataKey="mae" color="#ef4444" />
                    <ErrorMetricChart title="MAPE (Erro Percentual)" data={mapeData} dataKey="mape" unit="%" color="#f97316" />
                </div>
            </div>
        </>
    );
}

export default ModelDetails;