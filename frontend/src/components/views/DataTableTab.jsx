import { useState, useMemo, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import FilterControls from '../features/datatable/FilterControls';
import Pagination from '../ui/Pagination';

const ITEMS_PER_PAGE = 15;

const DataTableTab = ({ apiResponse }) => {
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'index', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);

  const unifiedData = useMemo(() => {
    if (!apiResponse || !apiResponse.resultados) return [];
    return apiResponse.resultados.map((item, index) => ({
      index,
      ...item.dados_processados_completos,
      Target1_Previsto: item.previsoes.Target1,
      Target2_Previsto: item.previsoes.Target2,
      Target3_Previsto: item.previsoes.Target3,
    }));
  }, [apiResponse]);

  const headers = unifiedData.length > 0 ? Object.keys(unifiedData[0]) : [];
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...unifiedData];

    filtered = filtered.filter(item => {
      // Pega todos os possíveis filtros do estado
      const { 
        target1PrevistoMin, target1PrevistoMax, 
        target2PrevistoMin, target2PrevistoMax, 
        target3PrevistoMin, target3PrevistoMax,
        target1RealMin, target1RealMax,
        target2RealMin, target2RealMax,
        target3RealMin, target3RealMax,
      } = filters;
      
      const checkRange = (value, min, max) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return true; // Ignora se o valor não for um número
        
        const numMin = parseFloat(min);
        const numMax = parseFloat(max);
        
        // Verifica se o valor está fora do range (se os limites existirem)
        if (!isNaN(numMin) && numValue < numMin) return false;
        if (!isNaN(numMax) && numValue > numMax) return false;
        
        return true; // Passou em todas as verificações
      };
      
      // Aplica os filtros para CADA um dos 6 ranges
      if (!checkRange(item.Target1_Previsto, target1PrevistoMin, target1PrevistoMax)) return false;
      if (!checkRange(item.Target2_Previsto, target2PrevistoMin, target2PrevistoMax)) return false;
      if (!checkRange(item.Target3_Previsto, target3PrevistoMin, target3PrevistoMax)) return false;
      
      if (!checkRange(item.Target1, target1RealMin, target1RealMax)) return false;
      if (!checkRange(item.Target2, target2RealMin, target2RealMax)) return false;
      if (!checkRange(item.Target3, target3RealMin, target3RealMax)) return false;

      return true; // Se a linha chegou até aqui, ela passou em todos os filtros
    });

    if (sortConfig.key) {
      //... lógica de ordenação inalterada ...
       filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;

  }, [unifiedData, filters, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-slate-800">Dados Completos com Previsões</h2>
      </div>

      <FilterControls 
        data={unifiedData} 
        onFilterChange={setFilters}
        resultCount={filteredAndSortedData.length}
        totalCount={unifiedData.length}
      />

      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm overflow-x-auto">
        {/* ... JSX da tabela e paginação inalterado ... */}
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col" className="px-4 py-3 whitespace-nowrap">
                  <button onClick={() => handleSort(header)} className="flex items-center gap-1 hover:text-indigo-600">
                    {header.replace(/_/g, ' ')}
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.index} className="bg-white border-b hover:bg-slate-50">
                {headers.map((header) => (
                  <td key={`${row.index}-${header}`} className="px-4 py-3 whitespace-nowrap">
                    {typeof row[header] === 'number' && row[header] % 1 !== 0 && !String(row[header]).includes('.')
                      ? row[header].toFixed(2)
                      : String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default DataTableTab;