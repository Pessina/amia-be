import { Injectable } from '@nestjs/common';
import { SendGridService } from './providers/sendgrid.service';
import { AWSSESService } from './providers/awsses.service';

type Models = 'sendGrid' | 'aws';

@Injectable()
export class EmailService {
  constructor(private sendGrid: SendGridService, private awsSES: AWSSESService) {}

  async sendEmail(model: Models, to: string, content: string): Promise<void> {
    if (model === 'sendGrid') {
      this.sendGrid.sendEmail(to, 'Patient Visit', content);
    } else if (model === 'aws') {
      this.awsSES.sendEmail(to, 'Patient Visit', content);
    }
  }
}
