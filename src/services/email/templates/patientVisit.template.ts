import { format, utcToZonedTime } from 'date-fns-tz';
import { ProcessVisitRecordingResponse } from 'src/visit/visit.types';

export const createPatientVisitEmailSubject = (
  name: string,
  timestamp: string,
  timezone: string
): string => {
  const timestampInUserTimezone = utcToZonedTime(timestamp, timezone);
  const formattedTimestamp = format(timestampInUserTimezone, 'dd/MM/yyyy - HH:mm', {
    timeZone: timezone,
  });

  return `${name} - [${formattedTimestamp}]`;
};

export const createPatientVisitEmailBody = (data: ProcessVisitRecordingResponse): string => {
  let topicsHtml = '';

  data.medicalRecord.topics.forEach((t) => {
    topicsHtml += `
      <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 10px;">${t.title}</h3>
        <p>${t.content.replace(/\n/g, '<br/>')}</p>
      </div>`;
  });

  return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="margin-bottom: 40px;">
          <h1 style="color: #2F2F2F;">Resumo da Visita</h1>
        </div>
        <div style="margin-bottom: 40px;">
          <h2 style="color: #2F2F2F;">Registros Médicos</h2>
          ${topicsHtml}
        </div>
        <div style="margin-bottom: 40px;">
          <h2 style="color: #2F2F2F;">Transcrição</h2>
          <p>${data.transcription.replace(/\n/g, '<br/>')}</p>
        </div>
      </body>
    </html>
  `;
};

type TableData = {
  tableName: string;
  headers: string[];
  rows: string[][];
};

function convertGPTTableToHTMLTable(input: string): string {
  const sections: string[] = input.split('\n\n');
  let resultHTML = '';

  sections.forEach((section: string) => {
    const lines: string[] = section.split('\n');
    const tableName: string = lines[0];
    const headers: string[] = lines[1]
      .split('|')
      .map((header: string) => header.trim())
      .filter((header: string) => header);
    const rows: string[][] = lines
      .slice(2)
      .map((row: string) => row.split('|').map((cell: string) => cell.trim()));

    resultHTML += `<h2>${tableName}</h2>`;
    resultHTML += '<table border="1"><thead><tr>';
    headers.forEach((header: string) => {
      resultHTML += `<th>${header}</th>`;
    });
    resultHTML += '</tr></thead><tbody>';

    rows.forEach((row: string[]) => {
      resultHTML += '<tr>';
      row.forEach((cell: string) => {
        resultHTML += `<td>${cell}</td>`;
      });
      resultHTML += '</tr>';
    });

    resultHTML += '</tbody></table>';
  });

  return resultHTML;
}

const inputString = `...`; // Replace with your actual string
const htmlOutput: string = convertGPTTableToHTMLTable(inputString);

const example =
  '- Todos os sintomas e Queixas:\n\n| Sintoma/Queixa | Início | Piora | Localização | Periodicidade | Ritmo | Qualidade | Intensidade | Fatores Agravantes e de Alívio | Sintomas Concomitantes | Eventos Pregressos Semelhantes |\n|----------------|--------|-------|-------------|---------------|-------|-----------|-------------|--------------------------------|------------------------|-------------------------------|\n| Tosse          | Vida toda | Última semana | Pulmões | Constante | Mais intensa ao acordar | Seca, com secreção amarela e traços de sangue | Alta | - | Falta de ar ao subir escadas | Sim, mas sem sangue |\n| Falta de ar    | Última semana | - | Pulmões | Ao subir escadas | - | - | - | Subir escadas | Tosse | - |\n| Dor na coluna  | - | - | Coluna | - | - | - | - | - | - | - |\n| Dor no abdômen | - | - | Abdômen | - | - | - | - | - | - | - |\n\n- Remédios:\n\n| Remédio | Dose | Frequência |\n|---------|------|------------|\n| Plopidogrel | 5mg | Uma vez ao dia |\n| Aspirina | 100mg | Uma vez ao dia |\n| Rosuvastatina | 200mg | Uma vez ao dia |\n| Enalapril | 300mg | Uma vez ao dia |\n| Hidroclorotiazida | 150mg | Uma vez ao dia |\n| Glifage | 150mg | Três vezes ao dia |\n| Metformina | 200mg | Duas vezes ao dia |\n\n- Exames:\n\n| Exame | Tempo Decorrido |\n|-------|-----------------|\n| Raio-X | - |\n| Tomografia | - |\n\n- Cirurgias:\n\n| Cirurgia | Tempo Decorrido | Motivo |\n|----------|-----------------|--------|\n| Cateterismo | 5 anos atrás | Infarto |\n\n- Alergias:\n\n| Alergia | Reação |\n|---------|--------|\n| - | - |\n\n- Doenças do Paciente (presente e passado):\n\n| Doença | Tempo Decorrido Diagnóstico | Tratamento |\n|--------|-----------------------------|------------|\n| Infarto | 5 anos atrás | Cateterismo |\n| Pressão alta | - | Medicamentos |\n| Diabetes | 10 anos atrás | Medicamentos |\n\n- Doenças Família:\n\n| Doença | Parentesco |\n|--------|------------|\n| Câncer de pulmão | Pai |\n| Pressão alta | Mãe |\n| Diabetes | Mãe |\n\n- Maus Hábitos:\n\n| Hábito | Início | Término | Frequência |\n|--------|--------|---------|------------|\n| Fumar | Há 40 anos | - | Um maço por dia |\n| Beber | - | - | Finais de semana |\n\n- Bons Hábitos:\n\n| Hábito | Início | Término | Frequência |\n|--------|--------|---------|------------|\n| - | - | - | - |\n\n- Alimentação:\n\n| Alimentação |\n|-------------|\n| Normal |\n\n- Atividade Física:\n\n| Atividade | Frequência |\n|-----------|------------|\n| Caminhada | - |';
