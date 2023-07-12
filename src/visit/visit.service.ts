import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/services/email/email.service';
import { LLMService } from 'src/services/llm/llm.service';
import { STTService } from 'src/services/stt/stt.service';

@Injectable()
export class VisitService {
  constructor(private stt: STTService, private llm: LLMService, private email: EmailService) {}

  async processAudio(email: string, audio: Express.Multer.File): Promise<string> {
    const text = await this.stt.processAudio('whisper', audio);

    const buildPrompt = (text: string) => {
      return `
      Eu vou lhe fornecer um texto, que é a transcrição da consulta entre o médico e paciente. 

      Eu preciso que você resuma e o organize em 7 tópicos: 

      1 - Queixa principal e duração dos sintomas (Extrair o max de infos) 
      2 - Diferentes sistemas 
      3 - Historico pessoal (medicação, habitos, etc.) 
      4 - Historico familia 
      5 - Revisão dos exames que trouxe 
      6 - Exame físico 
      7 - Hipoteses diagnosticas e conduta (medicamentos, exames complementares, retorno, etc.)   
      
      IMPORTANTE: 
      
      - Todos os sintomas e nomes de remédio devem estar presentes na sua resposta.
      - Só escreva o que foi dito pelo paciente e pelo médico. Não crie hipósteses por conta própria

      Este é o texto: [${text}]`;
    };

    const messages = [
      {
        role: 'system' as const,
        content: buildPrompt(text),
      },
    ];

    const gptResponse = await this.llm.processText('gpt', messages);

    const emailContent = `
Original text:
${text}

ChatGPT response:
${gptResponse}`;

    console.log({ emailContent });

    this.email.sendEmail('sendGrid', email, emailContent);

    return emailContent;
  }
}
