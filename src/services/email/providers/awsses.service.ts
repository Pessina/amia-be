import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class AWSSESService {
  private ses: SESClient;

  constructor() {
    this.ses = new SESClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  public async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: { Data: text, Charset: 'UTF-8' },
        },
        Subject: { Data: subject, Charset: 'UTF-8' },
      },
      Source: 'Amia <amia-no-reply@amia.com.br>',
    };

    const sendEmailCommand = new SendEmailCommand(params);

    try {
      await this.ses.send(sendEmailCommand);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
