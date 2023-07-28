import { PatientVisitSummary } from 'src/services/llm/prompts/patientVisit.promp';

export type ProcessVisitRecordingResponse = {
  transcription: string;
  medicalRecord: PatientVisitSummary;
};
