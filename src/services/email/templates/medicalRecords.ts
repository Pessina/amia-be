import { ProcessVisitRecordingResponse } from 'src/visit/visit.types';

export const medicalRecordsEmailTemplate = (data: ProcessVisitRecordingResponse): string => {
  let topicsHtml = '';

  data.medicalRecords.topics.forEach((t) => {
    topicsHtml += `<h3>${t.title}</h3>
                       <p>${t.content}</p>`;
  });

  return `
    <html>
      <body>
        <h1>Resumo da Visita</h1>
        <h2>Transcrição</h2>
        <p>${data.transcription}</p>
        <h2>Registros Médicos</h2>
        ${topicsHtml}
      </body>
    </html>
  `;
};
