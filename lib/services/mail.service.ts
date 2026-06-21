import { type CreateEmailOptions, Resend } from "resend";
import { BASE_URL } from "../constants";

class MailService {
  private sender: string;
  private resend?: Resend;

  constructor(private appName: string = "CMS - Talktoayo") {
    this.sender = `${this.appName} <no-reply@talktoayo.xyz>`;
  }

  private getClient() {
    if (this.resend) return this.resend;

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured.");
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
    return this.resend;
  }

  async sendMail(options: Omit<CreateEmailOptions, "from">) {
    return await this.getClient().emails.send({
      ...options,
      from: this.sender,
    } as CreateEmailOptions);
  }

  async sendMagicLinkEmail({ to, url }: { to: string; url: string }) {
    try {
      await this.sendMail({
        subject: "Open your portfolio CMS",
        to,
        text: `Open this link to sign in to the CMS: ${url}`,
        html: `<p>Open <a href="${url}">this sign-in link</a> to access the CMS.</p><p>This link expires in 5 minutes and can only be used once.</p>`,
      });
    } catch (error) {
      console.error("[error_sending_magic_link_email]: ", error);
    }
  }

  async sendAccessGrantedEmail(to: string) {
    try {
      await this.sendMail({
        subject: "CMS Access Granted",
        to,
        text: `You've been granted access to the Talktoayo CMS Studio`,
        html: `You've been granted access to the Talktoayo.xyz CMS Studio. Login <a href="${BASE_URL}">here</a>.`,
      });
    } catch (error) {
      console.error("[error_sending_access_granted_email]: ", error);
    }
  }
}

export const mailService = new MailService();
