import axios from "axios";
import { config } from "../../config/env";
import { Company } from "../../types/company";

export class ApolloService {
  private readonly apiKey = config.apolloApiKey;

  private getEmployeeRange(employeeCount: number): string {
    if (employeeCount <= 10) return "1,10";
    if (employeeCount <= 50) return "11,50";
    if (employeeCount <= 200) return "51,200";
    if (employeeCount <= 1000) return "201,1000";
    if (employeeCount <= 5000) return "1001,5000";
    if (employeeCount <= 10000) return "5001,10000";
    if (employeeCount <= 50000) return "10001,50000";

    return "50001,1000000";
  }

  async enrichCompany(domain: string): Promise<Company> {
    const response = await axios.post(
      "https://api.apollo.io/api/v1/organizations/enrich",
      { domain },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
      },
    );

    const org = response.data.organization;

    return {
      name: org.name,
      domain: org.primary_domain,
      industry: org.industry,
      employeeCount: org.estimated_num_employees,
      keywords: org.keywords ?? [],
    };
  }

  async findSimilarCompanies(company: Company): Promise<Company[]> {
    const keywords = [...new Set(company.keywords ?? [])]
      .filter((keyword) => keyword && keyword.trim().length > 0)
      .slice(0, 100); // Apollo limit se safe

    const response = await axios.post(
      "https://api.apollo.io/api/v1/organizations/search",
      {
        q_organization_keyword_tags: keywords,

        organization_num_employees_ranges: [
          this.getEmployeeRange(company.employeeCount),
        ],

        per_page: 20,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
      },
    );

    const organizations = response.data.organizations ?? [];

    return organizations
      .map((org: any) => ({
        name: org.name,
        domain: org.primary_domain,
        industry: org.industry,
        employeeCount: org.estimated_num_employees,
      }))
      .filter((org: Company) => org.domain && org.domain !== company.domain);
  }
}
