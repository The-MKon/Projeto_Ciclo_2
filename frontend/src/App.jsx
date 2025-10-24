import { useState } from 'react';
import { Upload, BarChart3, LineChart, TrendingUp, FileSpreadsheet, X, Sparkles, ChevronDown, CheckCircle, AlertTriangle, Download, Loader2 } from 'lucide-react';

// Serviços de API
import { uploadAndProcessFile, downloadProcessedCsv } from './services/apiService';

// Componentes de visualização (abas)
import OverviewTab from './components/views/OverviewTab';
import DataTableTab from './components/views/DataTableTab';
import TrendsTab from './components/views/TrendsTab';
import DetailedTab from './components/views/DetailedTab';

export default function DataAnalysisDashboard() {
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  
  // Estados para controle da API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsLoading(true);
      setError(null);
      setAnalysisData(null);
      setIsFileUploaded(false);

      try {
        // Chamada real à API
        const apiResponse = await uploadAndProcessFile(uploadedFile);
        setAnalysisData(apiResponse); // Salva a resposta REAL da API
        setTimeout(() => setIsFileUploaded(true), 300);
      } catch (err) {
        setError(err.message || "Ocorreu um erro desconhecido ao processar o arquivo.");
        setFile(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = async () => {
    if (!file) return;
    setIsDownloading(true);
    try {
      await downloadProcessedCsv(file);
    } catch (err) {
      setError("Falha no download do CSV. Tente novamente.", err);
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const fakeEvent = { target: { files: e.dataTransfer.files } };
    handleFileUpload(fakeEvent);
  };

  const handleRemoveFile = () => {
    setIsFileUploaded(false);
    setFile(null);
    setAnalysisData(null);
    setError(null);
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'data', label: 'Dados', icon: FileSpreadsheet },
    { id: 'trends', label: 'Tendências', icon: TrendingUp },
    { id: 'detailed', label: 'Detalhada', icon: LineChart },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100 sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-slate-600">Análise inteligente de dados</p>
              </div>
            </div>
            {isFileUploaded && (
              <div className="flex items-center gap-4">
                 <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Baixar CSV
                </button>
                <button
                  onClick={handleRemoveFile}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <X className="w-4 h-4" />
                  Remover arquivo
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!isFileUploaded && !isLoading && (
          // ... Lógica da tela de Upload (com card de erro)...
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <div className="w-full max-w-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Faça upload dos seus dados
                </h2>
                <p className="text-slate-600">
                  Arraste seu arquivo ou clique para começar a análise
                </p>
              </div>

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
                  <div className="flex">
                    <AlertTriangle className="w-5 h-5 mr-3"/>
                    <div>
                      <p className="font-bold">Erro no Processamento</p>
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-purple-300 rounded-xl p-16 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileSpreadsheet className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      Arraste seu arquivo aqui
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                      ou clique para selecionar do seu computador
                    </p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md">
                      <Upload className="w-4 h-4" />
                      Selecionar arquivo
                    </div>
                    <p className="text-xs text-slate-400 mt-4">
                      Formatos aceitos: Excel (.xlsx, .xls)
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
                <p className="text-lg text-slate-700 font-medium">Processando seu arquivo...</p>
                <p className="text-sm text-slate-500">Isso pode levar alguns instantes.</p>
            </div>
        )}

        {isFileUploaded && analysisData && (
          <div className="space-y-6 animate-fadeIn">
            {/* ... Card de informação do arquivo ... */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-4 sm:p-6 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl flex-shrink-0">
                    <FileSpreadsheet className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-xl font-bold mb-1 truncate">{file?.name}</h3>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-indigo-100">
                      <span className="whitespace-nowrap">{(file?.size / 1024).toFixed(2)} KB</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline whitespace-nowrap">Carregado com sucesso</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline text-sm font-medium">Pronto</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
              <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-purple-50/30 relative">
                {/* ... Lógica das abas ... */}
                <div className="md:hidden px-4 py-2">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-full flex items-center justify-between px-5 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      {activeTabData && <activeTabData.icon className="w-4 h-4" />}
                      <span className="font-medium">{activeTabData?.label}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden z-50">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setIsMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                              activeTab === tab.id
                                ? 'bg-indigo-50 text-indigo-600 font-medium'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <nav className="hidden md:flex gap-1 px-4 py-2 overflow-x-auto" aria-label="Tabs" style={{ scrollbarWidth: 'thin' }}>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-white hover:text-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-8">
                {analysisData && (
                  <>
                    {activeTab === 'overview' && <OverviewTab apiResponse={analysisData} />}
                    {activeTab === 'data' && <DataTableTab apiResponse={analysisData} />}
                    {activeTab === 'trends' && <TrendsTab apiResponse={analysisData} />}
                    {activeTab === 'detailed' && <DetailedTab apiResponse={analysisData} />}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}