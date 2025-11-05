import { DiplomaViewer } from './DiplomaViewer';
import { AccordionSection, InfoRow } from './AccordionSection';
import { DownloadButtons } from './DownloadButtons';
import { VerificationResponse } from '../api/mockApi';

interface ResultsPanelProps {
  data: VerificationResponse;
  onReset: () => void;
}

export const ResultsPanel = ({ data, onReset }: ResultsPanelProps) => {
  if (data.status !== 'ok' || !data.student || !data.institution || !data.registration || !data.documents) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Resultado da Verificação</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Nova consulta"
        >
          Nova Consulta
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <DiplomaViewer
            frontImage={data.documents.diplomaImage.front}
            backImage={data.documents.diplomaImage.back}
          />
        </div>

        <div className="space-y-4">
          <AccordionSection title="Dados do Aluno" icon="user" defaultOpen>
            <dl className="space-y-1">
              <InfoRow label="Nome Completo" value={data.student.fullName} />
              <InfoRow label="CPF" value={data.student.cpf} />
              <InfoRow label="RG" value={data.student.rg} />
              <InfoRow label="Data de Nascimento" value={data.student.birthDate} />
              <InfoRow label="Nome do Pai" value={data.student.fatherName} />
              <InfoRow label="Nome da Mãe" value={data.student.motherName} />
              <InfoRow label="Naturalidade" value={data.student.birthPlace} />
            </dl>
          </AccordionSection>

          <AccordionSection title="Dados da Instituição" icon="building">
            <dl className="space-y-1">
              <InfoRow label="Nome da Instituição" value={data.institution.name} />
              <InfoRow label="CNPJ" value={data.institution.cnpj} />
              <InfoRow label="Endereço" value={data.institution.address} />
            </dl>
          </AccordionSection>

          <AccordionSection title="Registro da Instituição Emissora" icon="file">
            <dl className="space-y-1">
              <InfoRow label="Portaria" value={data.registration.ordinance} />
              <InfoRow label="Código MEC" value={data.registration.mecCode} />
              <InfoRow label="Livro" value={data.registration.book} />
              <InfoRow label="Página" value={data.registration.page} />
              <InfoRow label="Número" value={data.registration.number} />
            </dl>
          </AccordionSection>

          <DownloadButtons
            certificateUrl={data.documents.certificatePdf}
            transcriptUrl={data.documents.transcriptPdf}
            xmlUrl={data.documents.xml}
          />
        </div>
      </div>
    </div>
  );
};
