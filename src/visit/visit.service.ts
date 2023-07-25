import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { PatientService } from 'src/patient/patient.service';
import { EmailService } from 'src/services/email/email.service';
import { LLMMessage, LLMService } from 'src/services/llm/llm.service';
import {
  contextPrompt,
  createMedicalRecordPrompt,
  extractTopicsPrompt,
  formatJSON,
  patientVisitSummarySchema,
} from 'src/services/llm/prompts/patientVisitPrompts';
import { STTService } from 'src/services/stt/stt.service';

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
  ): Promise<string> {
    const text = await this.stt.processAudio('whisper', audio);
    const gptResponse = await this.processTranscription(text);
    const patient = await this.patientService.getPatientById(patientId);

    await this.email.sendEmail(
      'aws',
      email,
      `${patient.name} - [${format(new Date(requestTimestamp), 'dd/MM/yyyy - hh:mm')}]`,
      `${text}\n\n\n\n${gptResponse}`
    );

    return `${text}\n\n\n\n${gptResponse}`;
  }

  async processTranscription(transcription: string): Promise<string> {
    /*
      Optimizations:

        1 - Set up persona (doctor assistant on top tier hospital), goal of response (patient medical records)
        2 - Extract main topics (medicines, symptoms, exams, complaints, etc.)
        3 - Organize it on the output topics for medical record
        4 - Transform in JSON

      Learned: 

        - Topic extraction it's very consistent
        - Use main topic to create main response, make it more consistent
        - Split the response in specific topics make it's response more accurate and less prone to hallucination

      Try: 

         - Provide medical record examples
         - On each topic provide examples to guide GPT
    */

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
        content: formatJSON(medicalRecordNonFormatted.choices[0].message.content),
      },
    ];

    const medicalRecordFormatted = await this.llm.processText(
      'gpt',
      messages,
      patientVisitSummarySchema
    );
    return `${medicalRecordNonFormatted.choices[0].message.content}\n\n\n\n${medicalRecordFormatted.choices[0].message.function_call.arguments}`;
  }
}
