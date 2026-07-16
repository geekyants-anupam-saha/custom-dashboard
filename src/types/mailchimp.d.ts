declare module "@mailchimp/mailchimp_transactional" {
  interface MessageRequest {
    message: {
      from_email?: string;
      to?: Array<{ email: string; type?: string }>;
      subject?: string;
      text?: string;
    };
  }

  interface MailchimpClient {
    messages: {
      send(payload: MessageRequest): Promise<unknown>;
    };
  }

  function mailchimp(apiKey: string): MailchimpClient;

  export default mailchimp;
}
