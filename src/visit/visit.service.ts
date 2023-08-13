import { Injectable } from '@nestjs/common';
import { PatientService } from 'src/patient/patient.service';
import { EmailService } from 'src/services/email/email.service';
import { LLMService } from 'src/services/llm/llm.service';
import { PatientVisitSummary, patientVisitGPT } from 'src/services/llm/prompts/patientVisit.promp';
import { STTService } from 'src/services/stt/stt.service';
import { ProcessVisitRecordingResponse } from './visit.types';
import {
  createPatientVisitEmailBody,
  createPatientVisitEmailSubject,
} from 'src/services/email/templates/patientVisit.template';
import { PrismaService } from 'src/prisma.service';
import { Visit } from '@prisma/client';

@Injectable()
export class VisitService {
  constructor(
    private stt: STTService,
    private llm: LLMService,
    private email: EmailService,
    private patientService: PatientService,
    private prisma: PrismaService
  ) {}

  async createVisit(patientId: number, requestTimestamp: Date): Promise<Visit> {
    return this.prisma.visit.create({
      data: {
        patientId: patientId,
        visitDate: requestTimestamp,
      },
    });
  }

  async getAllVisitsForPatient(patientId: number): Promise<Visit[]> {
    return await this.prisma.visit.findMany({
      where: {
        patientId: patientId,
      },
    });
  }

  async processVisitRecording(
    email: string,
    audio: Express.Multer.File,
    patientId: number,
    timestamp: string,
    timezone: string
  ): Promise<ProcessVisitRecordingResponse> {
    const transcription = await this.stt.processAudio('whisper', audio);

    const { topics: medicalRecord, extractTopics } = await this.processTranscription(transcription);
    const patient = await this.patientService.getPatientById(patientId);

    await this.email.sendEmail(
      'aws',
      email,
      createPatientVisitEmailSubject(patient.name, timestamp, timezone),
      createPatientVisitEmailBody({
        transcription: `${transcription}\n\n\n\n${extractTopics}`,
        medicalRecord: medicalRecord,
      })
    );

    return {
      transcription: transcription,
      medicalRecord: medicalRecord,
    };
  }

  async processTranscription(
    transcription: string
  ): Promise<{ topics: PatientVisitSummary; extractTopics: string }> {
    const mainTopics = await this.llm.processText(
      'gpt',
      patientVisitGPT.getMainTopics(transcription)
    );

    const medicalRecords = await this.llm.processText(
      'gpt',
      patientVisitGPT.createMedicalRecord(
        transcription,
        mainTopics.messages[mainTopics.messages.length - 1]
      )
    );

    return {
      topics: JSON.parse(medicalRecords.messages[medicalRecords.messages.length - 1]),
      extractTopics: mainTopics.messages[mainTopics.messages.length - 1],
    };
  }
}
