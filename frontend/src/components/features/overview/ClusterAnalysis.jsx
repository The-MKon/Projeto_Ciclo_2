import { Users, Info } from 'lucide-react';

const ClusterAnalysis = ({ clusters }) => {
  // Se a API não retornar clusters, mostramos um aviso
  if (!clusters || clusters.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 shadow-sm md:col-span-2">
        <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Análise de Clusters
        </h3>
        <div className="bg-white/70 rounded-lg p-4 border border-purple-100 shadow-inner h-full flex items-center justify-center">
            <div className="text-center text-slate-500">
                <Info className="w-8 h-8 mx-auto mb-2 text-purple-400"/>
                <p className="font-medium">Análise de clusters não disponível.</p>
                <p className="text-sm">Esta informação não foi retornada pelo endpoint atual.</p>
            </div>
        </div>
      </div>
    );
  }
  
  // ... o resto do código da tabela permanece igual ...
};

export default ClusterAnalysis;