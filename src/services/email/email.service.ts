import { Injectable } from '@nestjs/common';

import { AWSSESService } from './providers/awsses.service';

type Models = 'sendGrid' | 'aws';

@Injectable()
export class EmailService {
  constructor(private awsSES: AWSSESService) {}

  async sendEmail(model: Models, to: string, content: string): Promise<void> {
    if (model === 'aws') {
      this.awsSES.sendEmail(to, 'Patient Visit', content);
    }
  }
}
