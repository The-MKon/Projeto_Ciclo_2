import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';

const FilterControls = ({ onFilterChange, resultCount, totalCount }) => {
  // ADICIONADO: Estado para os targets reais
  const [localFilters, setLocalFilters] = useState({
    target1PrevistoMin: '', target1PrevistoMax: '',
    target2PrevistoMin: '', target2PrevistoMax: '',
    target3PrevistoMin: '', target3PrevistoMax: '',
    target1RealMin: '', target1RealMax: '',
    target2RealMin: '', target2RealMax: '',
    target3RealMin: '', target3RealMax: '',
  });

  const handleInputChange = (filterName, value) => {
    setLocalFilters(prev => ({ ...prev, [filterName]: value }));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(localFilters);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localFilters, onFilterChange]);

  const clearFilters = () => {
    // ADICIONADO: Limpar os novos campos de filtro
    setLocalFilters({
      target1PrevistoMin: '', target1PrevistoMax: '',
      target2PrevistoMin: '', target2PrevistoMax: '',
      target3PrevistoMin: '', target3PrevistoMax: '',
      target1RealMin: '', target1RealMax: '',
      target2RealMin: '', target2RealMax: '',
      target3RealMin: '', target3RealMax: '',
    });
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        {/* ... Seção do título e contador (inalterada) ... */}
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Filter className="w-5 h-5 text-indigo-600" />
          Filtros
        </h3>
        <div className="text-sm font-medium text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
          Mostrando <span className="font-bold text-indigo-600">{resultCount}</span> de <span className="font-bold">{totalCount}</span> resultados
        </div>
        <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
          <X className="w-4 h-4" /> Limpar Filtros
        </button>
      </div>
      {/* ALTERAÇÃO: Grid agora com 6 colunas em telas grandes para melhor alinhamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* --- FILTROS DE PREVISÃO --- */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Target 1 (Previsto)</label>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Mín" value={localFilters.target1PrevistoMin} onChange={(e) => handleInputChange('target1PrevistoMin', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            <input type="number" placeholder="Máx" value={localFilters.target1PrevistoMax} onChange={(e) => handleInputChange('target1PrevistoMax', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Target 2 (Previsto)</label>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Mín" value={localFilters.target2PrevistoMin} onChange={(e) => handleInputChange('target2PrevistoMin', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            <input type="number" placeholder="Máx" value={localFilters.target2PrevistoMax} onChange={(e) => handleInputChange('target2PrevistoMax', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Target 3 (Previsto)</label>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Mín" value={localFilters.target3PrevistoMin} onChange={(e) => handleInputChange('target3PrevistoMin', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            <input type="number" placeholder="Máx" value={localFilters.target3PrevistoMax} onChange={(e) => handleInputChange('target3PrevistoMax', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
        </div>

        {/* --- NOVO: FILTROS DE DADOS REAIS --- */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Target 1 (Real)</label>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Mín" value={localFilters.target1RealMin} onChange={(e) => handleInputChange('target1RealMin', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            <input type="number" placeholder="Máx" value={localFilters.target1RealMax} onChange={(e) => handleInputChange('target1RealMax', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Target 2 (Real)</label>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Mín" value={localFilters.target2RealMin} onChange={(e) => handleInputChange('target2RealMin', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            <input type="number" placeholder="Máx" value={localFilters.target2RealMax} onChange={(e) => handleInputChange('target2RealMax', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Target 3 (Real)</label>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Mín" value={localFilters.target3RealMin} onChange={(e) => handleInputChange('target3RealMin', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
            <input type="number" placeholder="Máx" value={localFilters.target3RealMax} onChange={(e) => handleInputChange('target3RealMax', e.target.value)} className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;