/*
  # Adicionar URLs de PDF aos diplomas

  ## Descrição
  Adiciona campos para armazenar URLs dos PDFs do diploma (frente e verso)
  para permitir visualização e download.

  ## Alterações
  
  1. **dados_aluno**
     - Adiciona `pdf_frente_url` (text) - URL do PDF da frente do diploma
     - Adiciona `pdf_verso_url` (text) - URL do PDF do verso do diploma
     - Ambos campos são opcionais (podem ser NULL)

  ## Notas
  - Campos são opcionais para permitir diplomas sem PDF cadastrado
  - URLs podem apontar para storage do Supabase ou serviços externos
*/

-- Adicionar campos de URL de PDF
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dados_aluno' AND column_name = 'pdf_frente_url'
  ) THEN
    ALTER TABLE dados_aluno ADD COLUMN pdf_frente_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dados_aluno' AND column_name = 'pdf_verso_url'
  ) THEN
    ALTER TABLE dados_aluno ADD COLUMN pdf_verso_url text;
  END IF;
END $$;
