import { Injectable } from '@nestjs/common';
import { SendGridService } from './providers/sendgrid.service';

type Models = 'sendGrid';

@Injectable()
export class EmailService {
  constructor(private sendGrid: SendGridService) {}

  async sendEmail(model: Models, to: string, content: string): Promise<void> {
    if (model === 'sendGrid') {
      this.sendGrid.sendEmail(to, 'Patient Visit', content);
    }
  }
}
