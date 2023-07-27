import { format } from 'date-fns';
import { ProcessVisitRecordingResponse } from 'src/visit/visit.types';

export const createPatientVisitEmailSubject = (name: string, requestTimestamp: string): string =>
  `${name} - [${format(new Date(requestTimestamp), 'dd/MM/yyyy - hh:mm')}]`;

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
