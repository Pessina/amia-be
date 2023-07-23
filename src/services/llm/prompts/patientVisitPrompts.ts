import { GPTSchema } from '../models/gpt.service';

export const contextPrompt = `Você é assistente de um médico no Albert Einstein, São Paulo`;

export const extractTopicsPrompt = (transcription: string): string => `
  Dada a transcrição de uma consulta médica, liste:
  
  - Sintomas atuais, para cada sintoma informe: atribua uma nota de 0 a 5 de acordo com a preocupação do paciente (5 = muito preocupado), data relativa de início e piora
  - Todas as queixas, para cada queixa informe: atribua uma nota de 0 a 5 de acordo com a preocupação do paciente (5 = muito preocupado), data relativa de início e piora
  - Remédios, para cada remédio informe: doses e frequência
  - Exames, para exame sintoma informe: data relativa
  - Cirurgias, para cada cirugia informe: data relativa, motivo
  - Alergias
  - Doenças atuais/anteriores do paciente, para cada doença informe: data relativa de diagnóstico, tratamento
  - Doenças existentes na família, para cada doença informe: grau de parentesco
  - Maus hábitos e consumo de sustâncias prejudiciais ao corpo, para cada item informe: data relativa de início/fim e frequência
  - Bons hábitos, para cada item informe: data relativa de início/fim e frequência
  - Alimentação
  - Atividade física

  Legenda: 
   - data relativa = dias, meses, anos, não mencionado

  Transcrição da consulta: """${transcription}"""
`;

export const createMedicalRecordPrompt = (extractTopics: string): string => `
  Sabendo que estas são as palavras chaves da trascrição: """${extractTopics}"""

  Escreva o prontuário médico do paciente organizado em 9 tópicos:

  1 - Queixa principal e duração dos sintomas (semanas, meses, anos)
  2 - Outras queixas e sintomas
  3 - Diferentes sistemas 
  4 - Medicamentos consumidos: doses e frequencia
  5 - Historico pessoal: hábitos, doenças anteriores, alergias, cirurgias
  6 - Historico familiar
  7 - Exames realizados 
  8 - Exame físico 
  9 - Diagnóstico do médico
  10 - Exames prescritos pelo médico
  11 - Medicamentos prescritos pelo médico

  Siga estas regras:

  - Cada tópico deve ter de pelos menos 2 linhas
  - Escreva baseado apenas no que o paciente e médico falaram, não invente informações
`;

export const formatJSON = (medicalRecord: string): string => `
  Formate o prontuário médico em JSON: """${medicalRecord}"""

  O JSON deve ser neste formato: 

  {
    "topics": [
      {
        "title": "topic title",
        "content": "topic contente"
      }
    ]
  }

  Apenas formate a resposta, não adicione ou remova informações
  A ordem dos tópicos no array deve ser a mesma dos tópicos no prontuário médico
`;

export const patientVisitSummarySchema: GPTSchema = {
  type: 'object',
  properties: {
    topics: { type: 'array', items: { title: 'topic title', content: 'topic contente' } },
  },
};
