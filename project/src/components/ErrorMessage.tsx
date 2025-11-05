import { AlertCircle, XCircle } from 'lucide-react';

interface ErrorMessageProps {
  type: 'not_found' | 'error';
  query: string;
  onReset: () => void;
}

export const ErrorMessage = ({ type, query, onReset }: ErrorMessageProps) => {
  const isNotFound = type === 'not_found';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-red-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            {isNotFound ? (
              <AlertCircle className="w-8 h-8 text-red-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {isNotFound ? 'Registro Não Encontrado' : 'Erro na Consulta'}
          </h2>

          <p className="text-gray-600 mb-2">
            {isNotFound
              ? 'Nenhum registro encontrado para esse código ou CPF.'
              : 'Erro ao consultar. Tente novamente.'}
          </p>

          {query && (
            <p className="text-sm text-gray-500 mb-6">
              Consulta: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{query}</span>
            </p>
          )}

          <button
            onClick={onReset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            aria-label="Tentar novamente"
          >
            Tentar Novamente
          </button>

          {isNotFound && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Dicas para consulta:</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Verifique se o código foi digitado corretamente</li>
                <li>• CPF deve conter 11 dígitos</li>
                <li>• Códigos de verificação são alfanuméricos</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
