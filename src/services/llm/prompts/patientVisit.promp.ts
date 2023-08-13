// cSpell:disable

import { Prompt } from './prompts.types';

const getMainTopicsTable = (transcription: string): Prompt[] => [
  {
    id: 'mainTopics',
    model: 'gpt-4',
    role: 'user',
    content: `
    DADA:
      - Transcrição da consulta médica: '''${transcription}'''

    Organize as informações da trascrição nas seguintes tabelas:

      - Todos os sintomas e queixas:
          - Colunas: Sintoma/Queixa, Início, Piora, Localização, Periodicidade, Ritmo, Qualidade, Intensidade, Fatores Agravantes e de Alívio, Sintomas Concomitantes, Eventos Pregressos Semelhantes
          - Sintoma/Queixa: Nome do sintoma/queixa utilizando código CID-10. Quando apropriado, utilize TERMOS CLÍNICOS (e.g. Estridor, Cefaleia, Dispneia, Acusia)
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

      - Medicações:
          - Colunas: Medicação, Dose, Frequência

      - Exames:
          - Colunas: Exame, Tempo Decorrido

      - Cirurgias:
          - Colunas: Cirurgia, Tempo Decorrido, Motivo

      - Alergias:
          - Coluna: Alergia, Reação
          
      - Doenças do Paciente (presente e passado):
          - Colunas: Doença, Tempo Decorrido Diagnóstico, Tratamento
          - Doença: Nome da donça utilizando código CID-10
          
      - Doenças Família:
          - Colunas: Doença, Parentesco
          - Doença: Nome da donça utilizando código CID-10
        
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

const createMedicalRecord = (transcription: string, mainTopics: string): Prompt[] => [
  {
    id: 'medialRecords',
    model: 'gpt-4',
    role: 'user',
    content: `
    DADA:
      - Transcrição da consulta médica: '''${transcription}'''
      - Tópicos principais de uma consulta médica: '''${mainTopics}'''

    Escreva o prontuário médico do paciente organizado em 9 tópicos:

      1 - Queixa principal e duração
      2 - História pregressa da moléstia atual
      3 - Interrogatório sobre diversos aparelhos
          - Classifique os sintomas e queixas em: Sistema Nervoso (SN), Segmento Cefálico (SC) Crânio e Face, Sistema Pulmonar (SP), Sistema Cardiovascular (SCV), Trato Gastro-Intestinal (TGI), Renal / Metabólico (R/M): Genito-Urinário, Sistema Osteoarticular (SOA), Extremidades.
          - Não mencione o aparelho caso não haja um sintoma/queixa relacionado
      4 - Antecedentes pessoais
      5 - Antecedentes familiares
      6 - Medicações de uso habitual
      7 - Exame físico
          - Descrito com as palavras do médico
      8 - Hipóteses diagnósticas (Código CID-10)
          - Escreva, exclusivamente, baseado no que o médico e paciente falaram
          - Escreva, exclusivamente, relativo a queixa princinpal
      9 - Conduta
          - Escreva, exclusivamente, baseado no que o médico e paciente falaram
          - Exames, medicamentos, procedimentos encaminhamentos e retorno prescritos pelo médico

    NOTA:
      - Escreva de forma flúida e natural, como se fosse um médico escrevendo o prontuário
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
