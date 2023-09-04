import { Response } from 'express';

interface MessageOptions {
  data: unknown;
  id?: string | number;
  event?: string;
  retry?: number;
}

export class SSEHandler {
  private res: Response;
  private keepAliveInterval: NodeJS.Timeout | null = null;

  constructor(res: Response) {
    this.res = res;
    this.res.setHeader('Content-Type', 'text/event-stream');
    this.res.setHeader('Cache-Control', 'no-cache');
    this.res.setHeader('Connection', 'keep-alive');
    this.res.flushHeaders();
  }

  sendMessage(options: MessageOptions): void {
    const { data, id, event, retry } = options;

    let message = '';

    if (event) {
      message += `event: ${event}\n`;
    }

    if (id) {
      message += `id: ${id}\n`;
    }

    if (retry) {
      message += `retry: ${retry}\n`;
    }

    message += `data: ${JSON.stringify(data)}\n\n`;

    this.res.write(message);
  }

  startKeepAlive(interval = 15000): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }

    this.keepAliveInterval = setInterval(() => {
      this.sendMessage({ data: 'keep-alive' });
    }, interval);
  }

  stopKeepAlive(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  closeConnection(): void {
    this.stopKeepAlive();
    this.res.end();
  }
}
