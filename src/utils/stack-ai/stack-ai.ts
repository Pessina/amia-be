import fetch from 'node-fetch';

export default class StackAI<T extends { user_id: string }, U> {
  apiKey: string;
  orgId: string;
  flowId: string;

  constructor(config: { apiKey: string; orgId: string; flowId: string }) {
    this.apiKey = config.apiKey;
    this.orgId = config.orgId;
    this.flowId = config.flowId;
  }

  async query(data: T): Promise<U> {
    const response = await fetch(
      `https://www.stack-inference.com/run_deployed_flow?flow_id=${this.flowId}&org=${this.orgId}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      },
    );
    const result = (await response.json()) as U;
    return result;
  }
}
