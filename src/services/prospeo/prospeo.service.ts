import axios from "axios";
import { config } from "../../config/env";
import { Person } from "../../types/person";

export class ProspeoService {
  private readonly apiKey = config.prospeoApiKey;

  async findDecisionMakers(
    companyDomain: string
  ): Promise<Person[]> {
    try {
      const response = await axios.post(
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
        }
      );

      const results =
        response.data.results ?? [];

      const prospects = results
        .map((item: any) => ({
          id:
            item.person?.person_id ?? "",

          fullName:
            item.person?.full_name ?? "",

          title:
            item.person?.current_job_title ?? "",

          company:
            item.company?.name ?? "",

          linkedinUrl:
            item.person?.linkedin_url ?? "",

          seniority:
            item.person?.job_history?.[0]
              ?.seniority ?? "",

          email:
            item.person?.email?.email ?? "",

          emailStatus:
            item.person?.email?.status ?? "",

          companyDomain:
            item.company?.domain ?? "",

          employeeCount:
            item.company?.employee_count ?? 0,
        }))
        .filter((person: any) => {
          const seniority =
            person.seniority?.toLowerCase();

          return [
            "manager",
            "partner",
          ].includes(seniority);
        });

      return prospects;
    } catch (error: any) {
      console.error(
        "Prospeo Error:",
        error.response?.data ||
          error.message
      );

      return [];
    }
  }
}