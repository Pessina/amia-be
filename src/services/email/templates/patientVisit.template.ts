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

export const createPatientVisitEmailBody = (
  data: ProcessVisitRecordingResponse & { mainTopicsTable: string }
): string => {
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
          ${convertGPTTableToHTMLTable(data.mainTopicsTable)}
        </div>
      </body>
    </html>
  `;
};

function convertGPTTableToHTMLTable(input: string): string {
  const sections: string[] = input.split('\n\n');
  let resultHTML = '';

  function processRow(row: string): string[] {
    return row
      .split('|')
      .map((cell) => cell.trim())
      .filter((cell) => cell);
  }

  function buildTable(headers: string[], rows: string[][]): string {
    return `
          <table border="1">
              <thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead>
              <tbody>
                  ${rows
                    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
                    .join('')}
              </tbody>
          </table>
      `;
  }

  for (let i = 0; i < sections.length; i += 2) {
    if (i + 1 >= sections.length) {
      throw new Error(`Skipping a section due to insufficient lines. Input: ${input}`);
    }

    const tableName: string = sections[i].replace('-', '').trim();
    const lines: string[] = sections[i + 1].split('\n');

    if (!lines.length) continue; // Skipping empty sections

    const headers: string[] = processRow(lines[0]);
    const rows: string[][] = lines
      .slice(1)
      .map(processRow)
      .filter((row) => !row.join('').includes('----'));

    resultHTML += `<h2>${tableName}</h2>`;
    resultHTML += buildTable(headers, rows);
  }

  const styles = `
        <style>
              table {
                  border-collapse: collapse;
                  font-family: Arial, sans-serif;
                  border: 1px solid #e0e0e0;
                  margin-bottom: 20px;
              }

              h2 {
                  font-family: Arial, sans-serif;
                  color: #333;
                  font-size: 24px;
                  margin-bottom: 10px;
              }

              th, td {
                  padding: 10px 15px;
                  text-align: left;
              }

              th {
                  background-color: #f5f5f5;
                  color: #555;
                  border-bottom: 2px solid #e0e0e0;
              }

              td {
                  border-bottom: 1px solid #e0e0e0;
              }

              tr:nth-child(even) {
                  background-color: #fafafa;
              }

              tr:hover {
                  background-color: #f0f0f0;
              }
      </style>
  `;

  return resultHTML + styles;
}
