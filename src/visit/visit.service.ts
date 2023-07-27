import { Injectable } from '@nestjs/common';
import { PatientService } from 'src/patient/patient.service';
import { EmailService } from 'src/services/email/email.service';
import { LLMMessage, LLMService } from 'src/services/llm/llm.service';
import {
  PatientVisitSummary,
  contextPrompt,
  createMedicalRecordPrompt,
  extractTopicsPrompt,
  formatJSONPrompt,
  patientVisitSummarySchema,
} from 'src/services/llm/prompts/patientVisitPrompts';
import { STTService } from 'src/services/stt/stt.service';
import { ProcessVisitRecordingResponse } from './visit.types';
import {
  createPatientVisitEmailBody,
  createPatientVisitEmailSubject,
} from 'src/services/email/templates/patientVisit.template';

@Injectable()
export class VisitService {
  constructor(
    private stt: STTService,
    private llm: LLMService,
    private email: EmailService,
    private patientService: PatientService
  ) {}

  async processVisitRecording(
    email: string,
    audio: Express.Multer.File,
    patientId: number,
    requestTimestamp: string
  ): Promise<ProcessVisitRecordingResponse> {
    const text = await this.stt.processAudio('whisper', audio);
    const medicalRecord = await this.processTranscription(text);
    const patient = await this.patientService.getPatientById(patientId);

    await this.email.sendEmail(
      'aws',
      email,
      createPatientVisitEmailSubject(patient.name, requestTimestamp),
      createPatientVisitEmailBody({ transcription: text, medicalRecord: medicalRecord })
    );

    return { transcription: text, medicalRecord: medicalRecord };
  }

  async processTranscription(transcription: string): Promise<PatientVisitSummary> {
    let messages: LLMMessage[] = [
      {
        role: 'system',
        content: contextPrompt,
      },
      {
        role: 'user',
        content: extractTopicsPrompt(transcription),
      },
    ];

    const extractTopics = await this.llm.processText('gpt', messages);

    messages.push({
      role: 'user',
      content: createMedicalRecordPrompt(extractTopics.choices[0].message.content),
    });

    const medicalRecordNonFormatted = await this.llm.processText('gpt', messages);

    messages = [
      {
        role: 'user',
        content: formatJSONPrompt(medicalRecordNonFormatted.choices[0].message.content),
      },
    ];

    const medicalRecordFormatted = await this.llm.processText(
      'gpt',
      messages,
      patientVisitSummarySchema
    );

    return JSON.parse(
      medicalRecordFormatted.choices[0].message.function_call.arguments
    ) as PatientVisitSummary;
  }
}
