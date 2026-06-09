import axios from "axios";
import { config } from "../../config/env";
import { Person } from "../../types/person";
import { retry } from "../../utils/retry";
import { logger } from "../../utils/logger";

export class ProspeoService {
  private readonly apiKey = config.prospeoApiKey;

  async findDecisionMakers(companyDomain: string): Promise<Person[]> {
    try {
      logger.info(`Searching prospects for ${companyDomain}`);

      const response = await retry(() =>
        axios.post(
          "https://api.prospeo.io/search-person",
          {
            page: 1,

            filters: {
              company: {
                websites: {
                  include: [companyDomain],
                },
              },
            },
          },
          {
            headers: {
              "X-KEY": this.apiKey,
              "Content-Type": "application/json",
            },
          },
        ),
      );

      const results = response.data.results ?? [];

      logger.success(`Prospeo returned ${results.length} records`);

      const prospects = results
        .map((item: any) => ({
          id: item.person?.person_id ?? "",

          fullName: item.person?.full_name ?? "",

          title: item.person?.current_job_title ?? "",

          company: item.company?.name ?? "",

          linkedinUrl: item.person?.linkedin_url ?? "",

          seniority: item.person?.job_history?.[0]?.seniority ?? "",

          email: item.person?.email?.email ?? "",

          emailStatus: item.person?.email?.status ?? "",

          revealed: item.person?.email?.revealed ?? false,
        }))
        .filter((person: any) => {
          const seniority = person.seniority?.toLowerCase();

          const isDecisionMaker = ["manager", "partner"].includes(seniority);

          const hasEmail = person.email;

          const isVerified = person.emailStatus === "VERIFIED";

          return isDecisionMaker && hasEmail && isVerified;
        });

      logger.success(
        `Filtered down to ${prospects.length} qualified prospects`,
      );

      return prospects;
    } catch (error: any) {
      logger.error(error.response?.data?.message || error.message);

      return [];
    }
  }
}
