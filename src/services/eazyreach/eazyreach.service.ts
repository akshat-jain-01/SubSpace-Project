import axios from "axios";
import { config } from "../../config/env";

export class EazyreachService {
  private authToken: string | null = null;

  private async getAuthToken(): Promise<string> {
    if (this.authToken) {
      return this.authToken;
    }

    const response = await axios.post(
      "https://api.superflow.run/b2b/createAuthToken/",
      {
        clientId: config.eazyreachClientId,
        clientSecret: config.eazyreachClientSecret,
      },

      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    this.authToken = response.data.authToken;

    return this.authToken!;
  }

  async findEmail(linkedinUrl: string): Promise<string | null> {
    try {
      const token = await this.getAuthToken();

      const response = await axios.post(
        "https://api.superflow.run/b2b/linkedin-emails",
        {
          linkedinUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const emails = response.data.emails ?? [];

      if (emails.length === 0) {
        return null;
      }

      return emails[0].email;
    } catch (error: any) {
      console.error("Eazyreach Error:", error.response?.data || error.message);

      return null;
    }
  }
}
