import { HttpStatus, Injectable } from '@nestjs/common';

import { AWSSESService } from './providers/awsses.service';
import { AppException } from 'src/filters/exceptions/AppException';

type Models = 'sendGrid' | 'aws';

@Injectable()
export class EmailService {
  constructor(private awsSES: AWSSESService) {}

  async sendEmail(model: Models, to: string, subject: string, content: string): Promise<void> {
    try {
      if (model === 'aws') {
        await this.awsSES.sendEmail(to, subject, content);
      }
    } catch (error) {
      console.error(`Failed to send email: ${error}`);
      throw new AppException(
        {
          code: 'EMAIL_SENDING_FAILED',
          meta: { target: ['email'] },
          message: 'Failed to send email',
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
