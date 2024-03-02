import axios from 'axios';
import { InteractRequest, InteractResponse } from './types';

export default class VoiceFlow {
  apiKey: string;

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey;
  }

  async interact(userId: string, request: InteractRequest): Promise<InteractResponse[]> {
    try {
      const response = await axios<InteractResponse[]>({
        method: 'POST',
        url: `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
        headers: { Authorization: this.apiKey },
        data: { request },
      });

      return response.data;
    } catch (error) {
      console.error('Error interacting with Voiceflow:', error);
      throw error;
    }
  }
}
