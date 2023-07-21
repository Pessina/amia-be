import { Injectable } from '@nestjs/common';

import { AWSSESService } from './providers/awsses.service';

type Models = 'sendGrid' | 'aws';

@Injectable()
export class EmailService {
  constructor(private awsSES: AWSSESService) {}

  async sendEmail(model: Models, to: string, subject: string, content: string): Promise<void> {
    if (model === 'aws') {
      await this.awsSES.sendEmail(to, subject, content);
    }
  }
}
