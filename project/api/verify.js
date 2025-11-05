export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "Faltando código de verificação"
    });
  }

  const mockData = {
    "ABC123456": {
      status: "ok",
      query: "ABC123456",
      student: {
        fullName: "João da Silva",
        cpf: "000.000.000-00",
        rg: "MG-12.345.678",
        birthDate: "01/01/1990",
        fatherName: "Pedro Silva",
        motherName: "Maria Silva",
        birthPlace: "Belo Horizonte - MG"
      },
      institution: {
        name: "Universidade Exemplo",
        cnpj: "12.345.678/0001-90",
        address: "Av. Exemplo, 1000, Bairro Centro, Belo Horizonte, MG, CEP 30100-000"
      },
      registration: {
        ordinance: "Portaria 123/2020",
        mecCode: "MEC-0001234",
        book: "Livro A",
        page: "123",
        number: "4567"
      },
      documents: {
        diplomaImage: {
          front: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
          back: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
        },
        certificatePdf: "#",
        transcriptPdf: "#",
        xml: "#"
      }
    },
    "12345ABC": {
      status: "ok",
      query: "12345ABC",
      student: {
        fullName: "João da Silva",
        cpf: "000.000.000-00",
        rg: "MG-12.345.678",
        birthDate: "01/01/1990",
        fatherName: "Pedro Silva",
        motherName: "Maria Silva",
        birthPlace: "Belo Horizonte - MG"
      },
      institution: {
        name: "Universidade Exemplo",
        cnpj: "12.345.678/0001-90",
        address: "Av. Exemplo, 1000, Bairro Centro, Belo Horizonte, MG, CEP 30100-000"
      },
      registration: {
        ordinance: "Portaria 123/2020",
        mecCode: "MEC-0001234",
        book: "Livro A",
        page: "123",
        number: "4567"
      },
      documents: {
        diplomaImage: {
          front: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
          back: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
        },
        certificatePdf: "#",
        transcriptPdf: "#",
        xml: "#"
      }
    },
    "00000000000": {
      status: "ok",
      query: "00000000000",
      student: {
        fullName: "Maria Santos",
        cpf: "111.111.111-11",
        rg: "SP-98.765.432",
        birthDate: "15/05/1992",
        fatherName: "José Santos",
        motherName: "Ana Santos",
        birthPlace: "São Paulo - SP"
      },
      institution: {
        name: "Faculdade Federal de Tecnologia",
        cnpj: "98.765.432/0001-10",
        address: "Rua das Flores, 500, Jardim América, São Paulo, SP, CEP 01400-000"
      },
      registration: {
        ordinance: "Portaria 456/2019",
        mecCode: "MEC-0005678",
        book: "Livro B",
        page: "456",
        number: "7890"
      },
      documents: {
        diplomaImage: {
          front: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
          back: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
        },
        certificatePdf: "#",
        transcriptPdf: "#",
        xml: "#"
      }
    },
    "XYZ789012": {
      status: "ok",
      query: "XYZ789012",
      student: {
        fullName: "Carlos Oliveira",
        cpf: "222.222.222-22",
        rg: "RJ-11.222.333",
        birthDate: "20/08/1988",
        fatherName: "Roberto Oliveira",
        motherName: "Fernanda Oliveira",
        birthPlace: "Rio de Janeiro - RJ"
      },
      institution: {
        name: "Instituto Nacional de Ensino Superior",
        cnpj: "33.444.555/0001-66",
        address: "Av. Atlântica, 2500, Copacabana, Rio de Janeiro, RJ, CEP 22070-000"
      },
      registration: {
        ordinance: "Portaria 789/2021",
        mecCode: "MEC-0009012",
        book: "Livro C",
        page: "789",
        number: "3456"
      },
      documents: {
        diplomaImage: {
          front: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
          back: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
        },
        certificatePdf: "#",
        transcriptPdf: "#",
        xml: "#"
      }
    }
  };

  const normalizedQuery = query.replace(/[.\-/]/g, '').toUpperCase();
  const record = mockData[normalizedQuery] || mockData[query.toUpperCase()];

  if (!record) {
    return res.status(404).json({
      status: "not_found",
      query: query,
      message: "Registro não encontrado"
    });
  }

  return res.status(200).json(record);
}
