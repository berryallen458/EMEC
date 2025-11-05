import { useState } from 'react';
import { ChevronDown, User, Building2, FileText } from 'lucide-react';

interface AccordionSectionProps {
  title: string;
  icon: 'user' | 'building' | 'file';
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const icons = {
  user: User,
  building: Building2,
  file: FileText,
};

export const AccordionSection = ({
  title,
  icon,
  children,
  defaultOpen = false,
}: AccordionSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = icons[icon];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Recolher' : 'Expandir'} ${title}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-semibold text-gray-800 text-left">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 py-4 bg-white">{children}</div>
      </div>
    </div>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

export const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="py-2 border-b border-gray-100 last:border-0">
    <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
    <dd className="text-base text-gray-900">{value}</dd>
  </div>
);
