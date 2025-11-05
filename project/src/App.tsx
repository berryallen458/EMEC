import { useState, useEffect } from 'react';
import { SearchForm } from './components/SearchForm';
import { ResultsPanel } from './components/ResultsPanel';
import { ErrorMessage } from './components/ErrorMessage';
import { verifyDiplomaAPI, VerificationResponse } from './api/mockApi';
import { GraduationCap } from 'lucide-react';
import { getCodeFromURL, navigateToCode, navigateToHome, updatePageMetadata } from './utils/router';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const codeFromURL = getCodeFromURL();

    if (codeFromURL && initialLoad) {
      handleSearch(codeFromURL, false);
    }

    setInitialLoad(false);

    const handlePopState = () => {
      const code = getCodeFromURL();
      if (code) {
        handleSearch(code, false);
      } else {
        setResult(null);
        updatePageMetadata({
          title: 'Consulta E-MEC - Verificação de Diplomas',
          description: 'Sistema oficial de consulta e verificação de diplomas e registros acadêmicos do E-MEC'
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSearch = async (query: string, updateURL: boolean = true) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await verifyDiplomaAPI(query);
      setResult(response);

      if (response.status === 'ok' && updateURL) {
        navigateToCode(query);
      }

      if (response.status === 'ok' && response.student && response.institution) {
        updatePageMetadata({
          title: `Diploma de ${response.student.fullName} - E-MEC`,
          description: `Verificação do diploma de ${response.student.fullName}, formado(a) pela ${response.institution.name}. Sistema oficial E-MEC.`,
          studentName: response.student.fullName,
          institutionName: response.institution.name
        });
      }
    } catch (error) {
      setResult({
        status: 'error',
        query,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    navigateToHome();
    updatePageMetadata({
      title: 'Consulta E-MEC - Verificação de Diplomas',
      description: 'Sistema oficial de consulta e verificação de diplomas e registros acadêmicos do E-MEC'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label="Voltar para página inicial"
          >
            <div className="p-2 bg-blue-600 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sistema E-MEC</h1>
              <p className="text-sm text-gray-600">Ministério da Educação</p>
            </div>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {!result && !isLoading && (
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-600 font-medium">Carregando informações do diploma...</p>
            </div>
          </div>
        )}

        {result && result.status === 'ok' && !isLoading && (
          <ResultsPanel data={result} onReset={handleReset} />
        )}

        {result && (result.status === 'not_found' || result.status === 'error') && !isLoading && (
          <ErrorMessage
            type={result.status}
            query={result.query}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              Sistema de Consulta e Verificação de Diplomas - E-MEC
            </p>
            <p className="text-xs text-gray-500">
              Todos os dados são protegidos conforme a Lei Geral de Proteção de Dados (LGPD)
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Códigos de teste: ABC123456, 12345ABC, 00000000000, XYZ789012
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
