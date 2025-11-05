import { useState } from 'react';
import { Maximize2, ArrowLeftRight } from 'lucide-react';

interface DiplomaViewerProps {
  frontImage: string;
  backImage: string;
}

export const DiplomaViewer = ({ frontImage, backImage }: DiplomaViewerProps) => {
  const [showBack, setShowBack] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const currentImage = showBack ? backImage : frontImage;

  const toggleSide = () => {
    setShowBack(!showBack);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-4 relative group">
        <div className="relative">
          <img
            src={currentImage}
            alt={showBack ? 'Verso do diploma' : 'Frente do diploma'}
            className="w-full h-auto rounded-lg cursor-zoom-in transition-transform hover:scale-[1.02]"
            onClick={() => setIsLightboxOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsLightboxOpen(true);
              }
            }}
            aria-label={`Clique para ampliar ${showBack ? 'verso' : 'frente'} do diploma`}
          />

          <button
            onClick={toggleSide}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-lg shadow-lg transition-all duration-200 hover:scale-110"
            aria-label={`Mostrar ${showBack ? 'frente' : 'verso'} do diploma`}
            title={`Mostrar ${showBack ? 'frente' : 'verso'}`}
          >
            <ArrowLeftRight className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-lg shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Ampliar imagem"
            title="Ampliar"
          >
            <Maximize2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="mt-3 text-center text-sm text-gray-600">
          {showBack ? 'Verso do Diploma' : 'Frente do Diploma'}
        </div>
      </div>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada do diploma"
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-light w-12 h-12 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Fechar visualização ampliada"
          >
            ×
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSide();
            }}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white px-4 py-2.5 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
            aria-label={`Mostrar ${showBack ? 'frente' : 'verso'} do diploma`}
          >
            <ArrowLeftRight className="w-5 h-5 text-gray-700" />
            <span className="text-gray-700 font-medium">
              {showBack ? 'Ver Frente' : 'Ver Verso'}
            </span>
          </button>

          <img
            src={currentImage}
            alt={showBack ? 'Verso do diploma ampliado' : 'Frente do diploma ampliado'}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
