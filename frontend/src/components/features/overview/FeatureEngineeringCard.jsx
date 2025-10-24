import { Layers, Lightbulb } from 'lucide-react';

// const FeatureEngineeringCard = ({ totalFeatures, featureList }) => {
    const FeatureEngineeringCard = ({ totalFeatures }) => {
    
    // A mesma lógica que tínhamos para contar as features novas
    // const newFeaturesCount = featureList.filter(feature => 
    //   !/^(F\d|P\d|T\d|Q\d|L\d|Cor\d|Tempo\d)/.test(feature) && 
    //   feature !== 'Código de Acesso' && 
    //   feature !== 'Data/Hora Último'
    // ).length;

    const newFeaturesCount = 28

    return (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

                {/* Coluna da Esquerda: Métricas */}
                <div className="text-center bg-white p-6 rounded-lg border border-emerald-100 shadow-inner">
                    <Layers className="w-10 h-10 text-teal-600 mx-auto mb-3" />
                    <p className="text-5xl font-bold text-teal-600">{totalFeatures}</p>
                    <p className="text-slate-600 font-medium">Features Totais</p>
                    <p className="text-xs text-slate-500 mt-1">utilizadas no processamento</p>
                    
                    <hr className="my-4"/>

                    <p className="text-4xl font-bold text-emerald-600">{newFeaturesCount}</p>
                    <p className="text-slate-600 font-medium">Novas Features Criadas</p>
                    <p className="text-xs text-slate-500 mt-1">por engenharia de dados</p>
                </div>

                {/* Coluna da Direita: Explicação */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-lg">
                        <Lightbulb className="w-6 h-6 text-emerald-600" />
                        Por que criar novas features?
                    </h3>
                    <p className="text-sm text-slate-600">
                        Criar novas features (variáveis) a partir dos dados originais é um processo chamado **Engenharia de Features**.
                        Isso é crucial para "traduzir" informações complexas em algo que o modelo de Machine Learning possa entender e usar.
                    </p>
                    <p className="text-sm text-slate-600">
                        Features como <span className="font-semibold text-emerald-700">"Eficiência_Performance"</span> ou <span className="font-semibold text-emerald-700">"Dia_da_Semana"</span> não existem nos dados brutos, mas revelam padrões de comportamento que melhoram significativamente a precisão das previsões.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default FeatureEngineeringCard;