import { Injectable } from '@nestjs/common';
import { PatientService } from 'src/patient/patient.service';
import { EmailService } from 'src/services/email/email.service';
import { LLMMessage, LLMService } from 'src/services/llm/llm.service';
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
    requestTimestamp: string
  ): Promise<ProcessVisitRecordingResponse> {
    const transcription = await this.stt.processAudio('whisper', audio);
    const medicalRecord = await this.processTranscription(transcription);
    const patient = await this.patientService.getPatientById(patientId);

    await this.email.sendEmail(
      'aws',
      email,
      createPatientVisitEmailSubject(patient.name, requestTimestamp),
      createPatientVisitEmailBody({ transcription: transcription, medicalRecord: medicalRecord })
    );

    return { transcription: transcription, medicalRecord: medicalRecord };
  }

  async processTranscription(transcription: string): Promise<PatientVisitSummary> {
    let messages: LLMMessage[] = [
      {
        role: 'system',
        content: patientVisitGPT.context,
      },
      {
        role: 'user',
        content: patientVisitGPT.extractTopics(transcription),
      },
    ];

    const extractTopics = await this.llm.processText('gpt', messages);

    messages.push({
      role: 'user',
      content: patientVisitGPT.createMedicalRecord(extractTopics.choices[0].message.content),
    });

    const medicalRecordNonFormatted = await this.llm.processText('gpt', messages);

    messages = [
      {
        role: 'user',
        content: patientVisitGPT.formatJSON(medicalRecordNonFormatted.choices[0].message.content),
      },
    ];

    const medicalRecordFormatted = await this.llm.processText(
      'gpt',
      messages,
      patientVisitGPT.schema
    );

    return JSON.parse(
      medicalRecordFormatted.choices[0].message.function_call.arguments
    ) as PatientVisitSummary;
  }
}
