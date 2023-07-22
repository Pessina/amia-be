import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { PatientService } from 'src/patient/patient.service';
import { EmailService } from 'src/services/email/email.service';
import { LLMService } from 'src/services/llm/llm.service';
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
    console.log(`Processing audio file of size: ${audio.size} bytes`);

    const text = await this.stt.processAudio('whisper', audio);
    const gptResponse = await this.llm.processText('gpt', text);
    const patient = await this.patientService.getPatientById(patientId);

    await this.email.sendEmail(
      'aws',
      email,
      `${patient.name} - [${format(new Date(requestTimestamp), 'dd/MM/yyyy - hh:mm')}]`,
      `${text}\n\n\n\n${gptResponse}`
    );

    return `${text}\n\n\n\n${gptResponse}`;
  }
}
