import axios from "axios";
import { config } from "../../config/env";
import { retry } from "../../utils/retry";
import { logger } from "../../utils/logger";

export class BrevoService {
  private readonly apiKey = config.brevoApiKey;

  async sendEmail(toEmail: string, toName: string) {
    return retry(async () => {
      logger.info(`Sending email to ${toName} (${toEmail})`);

      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: config.senderName,
            email: config.senderEmail,
          },

          to: [
            {
              email: toEmail,
              name: toName,
            },
          ],

          subject: "Partnership Opportunity",

          htmlContent: `
            <p>Hi ${toName},</p>

            <p>
              We help companies automate
              lead discovery and outreach.
            </p>

            <p>
              Would love to connect.
            </p>

            <p>
              Regards,<br/>
              ${config.senderName}
            </p>
          `,
        },
        {
          headers: {
            "api-key": this.apiKey,
            "Content-Type": "application/json",
          },
        },
      );

      logger.success(`Email sent to ${toName}`);

      return response.data;
    });
  }
}
