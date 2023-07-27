import { PatientVisitSummary } from 'src/services/llm/prompts/patientVisitPrompts';

export type ProcessVisitRecordingResponse = {
  transcription: string;
  medicalRecords: PatientVisitSummary;
};
