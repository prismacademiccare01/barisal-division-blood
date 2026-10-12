export interface SMSProvider {
  sendSMS(phone: string, text: string): Promise<{ success: boolean; providerId?: string; error?: string }>;
}

export class MockSMSProvider implements SMSProvider {
  async sendSMS(phone: string, text: string) {
    console.log(`[SMS-SERVICE] [DEV/PROD-SIMULATOR] Sending SMS to ${phone}: "${text}"`);
    return { success: true, providerId: `sim_${Date.now()}` };
  }
}

export class GenericWebhookSMSProvider implements SMSProvider {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async sendSMS(phone: string, text: string) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ to: phone, message: text })
      });
      const data = await response.json();
      return { success: response.ok, providerId: data?.id };
    } catch (err: any) {
      console.error('[SMS-SERVICE] Delivery failed:', err?.message);
      return { success: false, error: err?.message };
    }
  }
}

// Factory to select provider based on environment
const smsApiUrl = process.env.SMS_API_URL;
const smsApiKey = process.env.SMS_API_KEY;

export const smsService: SMSProvider = (smsApiUrl && smsApiKey)
  ? new GenericWebhookSMSProvider(smsApiUrl, smsApiKey)
  : new MockSMSProvider();
