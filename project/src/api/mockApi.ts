export interface VerificationResponse {
  status: 'ok' | 'not_found' | 'error';
  query: string;
  student?: {
    fullName: string;
    cpf: string;
    rg: string;
    birthDate: string;
    fatherName: string;
    motherName: string;
    birthPlace: string;
  };
  institution?: {
    name: string;
    cnpj: string;
    address: string;
  };
  registration?: {
    ordinance: string;
    mecCode: string;
    book: string;
    page: string;
    number: string;
  };
  documents?: {
    diplomaImage: {
      front: string;
      back: string;
    };
    certificatePdf: string;
    transcriptPdf: string;
    xml: string;
  };
}

const mockData: Record<string, VerificationResponse> = {
  '12345ABC': {
    status: 'ok',
    query: '12345ABC',
    student: {
      fullName: 'João da Silva',
      cpf: '000.000.000-00',
      rg: 'MG-12.345.678',
      birthDate: '01/01/1990',
      fatherName: 'Pedro Silva',
      motherName: 'Maria Silva',
      birthPlace: 'Belo Horizonte - MG',
    },
    institution: {
      name: 'Universidade Exemplo',
      cnpj: '12.345.678/0001-90',
      address: 'Av. Exemplo, 1000, Bairro Centro, Belo Horizonte, MG, CEP 30100-000',
    },
    registration: {
      ordinance: 'Portaria 123/2020',
      mecCode: 'MEC-0001234',
      book: 'Livro A',
      page: '123',
      number: '4567',
    },
    documents: {
      diplomaImage: {
        front: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
        back: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
      },
      certificatePdf: '#',
      transcriptPdf: '#',
      xml: '#',
    },
  },
  '00000000000': {
    status: 'ok',
    query: '00000000000',
    student: {
      fullName: 'Maria Santos',
      cpf: '111.111.111-11',
      rg: 'SP-98.765.432',
      birthDate: '15/05/1992',
      fatherName: 'José Santos',
      motherName: 'Ana Santos',
      birthPlace: 'São Paulo - SP',
    },
    institution: {
      name: 'Faculdade Federal de Tecnologia',
      cnpj: '98.765.432/0001-10',
      address: 'Rua das Flores, 500, Jardim América, São Paulo, SP, CEP 01400-000',
    },
    registration: {
      ordinance: 'Portaria 456/2019',
      mecCode: 'MEC-0005678',
      book: 'Livro B',
      page: '456',
      number: '7890',
    },
    documents: {
      diplomaImage: {
        front: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
        back: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
      },
      certificatePdf: '#',
      transcriptPdf: '#',
      xml: '#',
    },
  },
};

export const verifyDiploma = async (query: string): Promise<VerificationResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const normalizedQuery = query.replace(/[.\-/]/g, '').toUpperCase();

  if (mockData[query] || mockData[normalizedQuery]) {
    return mockData[query] || mockData[normalizedQuery];
  }

  return {
    status: 'not_found',
    query,
  };
};

export const verifyDiplomaAPI = async (query: string): Promise<VerificationResponse> => {
  try {
    const response = await fetch(`/api/verify?query=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return {
          status: 'not_found',
          query,
        };
      }
      throw new Error(data.message || 'Erro ao consultar');
    }

    return data;
  } catch (error) {
    return verifyDiploma(query);
  }
};
