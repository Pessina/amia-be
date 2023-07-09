import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor() {
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
  }

  public async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const msg = {
      to: to,
      from: 'fs.pessina@gmail.com',
      subject: subject,
      text: text,
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    try {
      await sgMail.send(msg);
    } catch (e) {
      console.log('error');
    }
  }
}
