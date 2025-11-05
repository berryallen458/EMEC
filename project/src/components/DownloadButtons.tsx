import { Download, FileText, ScrollText, Code } from 'lucide-react';

interface DownloadButtonsProps {
  certificateUrl: string;
  transcriptUrl: string;
  xmlUrl: string;
}

export const DownloadButtons = ({
  certificateUrl,
  transcriptUrl,
  xmlUrl,
}: DownloadButtonsProps) => {
  const handleDownload = (url: string, filename: string) => {
    if (url === '#') {
      alert('Download de demonstração - arquivo não disponível');
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl p-6 border border-blue-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Download className="w-5 h-5 text-blue-600" />
        Documentos para Download
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleDownload(certificateUrl, 'certificado.pdf')}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group"
          aria-label="Baixar certificado em PDF"
          title="Baixar Certificado (PDF)"
        >
          <FileText className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Certificado</span>
        </button>

        <button
          onClick={() => handleDownload(transcriptUrl, 'historico.pdf')}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group"
          aria-label="Baixar histórico em PDF"
          title="Baixar Histórico (PDF)"
        >
          <ScrollText className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Histórico</span>
        </button>

        <button
          onClick={() => handleDownload(xmlUrl, 'dados.xml')}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group"
          aria-label="Baixar dados em XML"
          title="Baixar XML"
        >
          <Code className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">XML</span>
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Os documentos são gerados com assinatura digital válida
      </p>
    </div>
  );
};
