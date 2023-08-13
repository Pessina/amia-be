// cSpell:disable

import { Prompt } from './prompts.types';

const getMainTopicsTable = (transcription: string): Prompt[] => [
  {
    id: 'mainTopics',
    model: 'gpt-4',
    role: 'user',
    content: `
    DADA:
      - Transcrição da consulta: '''${transcription}'''

    Organize as informações da trascrição nas seguintes tabelas:

      - Todos os sintomas e Queixas:
          - Colunas: Sintoma/Queixa, Início, Piora, Localização, Periodicidade, Ritmo, Qualidade, Intensidade, Fatores Agravantes e de Alívio, Sintomas Concomitantes, Eventos Pregressos Semelhantes
          - Nome: Nome do sintoma/queixa. Preferencialmente, utilizando TERMOS CLÍNICOS (e.g. Estridor, Cefaleia, Dispneia, Acusia)
          - Início: Tempo decorrido desde o início do sintoma/queixa (dias, semanas, meses, anos, etc.)
          - Piora: Tempo decorrido desde a piora do sintoma/queixa (dias, semanas, meses, anos, etc.)
          - Localização: Onde o sintoma/queixa é percebido ou sentido pelo paciente
          - Periodicidade: Frequência com que o sintoma/queixa ocorre
          - Ritmo: Padrão de ocorrência do sintoma/queixa
          - Qualidade: Natureza ou característica distintiva do sintoma/queixa
          - Intensidade: Quão forte ou grave é o sintoma/queixa
          - Fatores Agravantes e de Alívio: O que piora ou melhora o sintoma/queixa
          - Sintomas Concomitantes: Outros sintomas que ocorrem junto com este
          - Eventos Pregressos Semelhantes: Episódios anteriores parecidos

      - Remédios:
          - Colunas: Remédio, Dose, Frequência

      - Exames:
          - Colunas: Exame, Tempo Decorrido

      - Cirurgias:
          - Colunas: Cirurgia, Tempo Decorrido, Motivo

      - Alergias:
          - Coluna: Alergia, Reação
          
      - Doenças do Paciente (presente e passado):
          - Colunas: Doença, Tempo Decorrido Diagnóstico, Tratamento
          
      - Doenças Família:
          - Colunas: Doença, Parentesco
        
      - Maus Hábitos:
          - Colunas: Hábito, Início, Término, Frequência

      - Bons Hábitos:
          - Colunas: Hábito, Início, Término, Frequência

      - Alimentação:
          - Coluna: Alimentação

      - Atividade Física:
          - Colunas: Atividade, Frequência

    NOTA:
      - Se a informação não foi mencionada, não estiver especificada, estiver ambígua ou não clara, preencher a célula com "-"
      - A saída deve ser exclusivamente as tabelas, sem texto adicional
      - Ao elaborar sua resposta, é essencial utilizar TERMOS CLÍNICOS (e.g. Estridor, Cefaleia, Dispneia, Acusia) sempre que apropriado.
      - Sua resposta não deve incluir PII (Personal Identifiable Information)
`,
  },
];

const createMedicalRecord = (transcription: string, extractTopics: string): Prompt[] => [
  {
    id: 'medialRecords',
    model: 'gpt-4',
    role: 'user',
    content: `
    DADA:
      - Transcrição da consulta: '''${transcription}'''
      - Tópicos principais: '''${extractTopics}'''

    Escreva o prontuário médico do paciente organizado em 9 tópicos:

      1 - Queixa principal e duração
      2 - História pregressa da moléstia atual
      3 - Interrogatório sobre diversos aparelhos
          -Classifique os sintomas e queixas em: Sistema Nervoso (SN), Segmento Cefálico (SC) Crânio e Face, Sistema Pulmonar (SP), Sistema Cardiovascular (SCV), Trato Gastro-Intestinal (TGI), Renal / Metabólico (R/M): Genito-Urinário, Sistema Osteoarticular (SOA), Extremidades.
      4 - Antecedentes pessoais
      5 - Antecedentes familiares
      6 - Medicações de uso habitual
          - Nome da medicação, dose e frequência
      7 - Exame físico
      8 - Hipóteses diagnósticas (Código CID-10)
          - Relativo a queixa princinpal
      9 - Conduta
          - Exames, medicamentos, procedimentos e encaminhamentos prescritos pelo médico

    NOTA:
      - Escreva exclusivamente baseado no que o paciente e médico falaram.
      - Ao elaborar sua resposta, é essencial utilizar TERMOS CLÍNICOS (e.g. Estridor, Cefaleia, Dispneia, Acusia) sempre que apropriado.
      - Sua resposta não deve incluir PII (Personal Identifiable Information)
      - A resposta deve ser em JSON, no seguinte formato (title e content devem ser strings em "plain text"):
      {{
          "topics": [
              {{
                  "title": "string",
                  "content": "string"
              }}
          ]
      }}
`,
    schema: {
      type: 'object',
      properties: {
        topics: {
          type: 'array',
          items: {
            title: 'string',
            content: 'string',
          },
        },
      },
    },
  },
];

export type PatientVisitSummary = {
  topics: { title: string; content: string }[];
};

export const patientVisitGPT = {
  getMainTopicsTable,
  createMedicalRecord,
};
