import { ApolloService } from "./services/apollo/apollo.service";
import { EazyreachService } from "./services/eazyreach/eazyreach.service";
import { ProspeoService } from "./services/prospeo/prospeo.service";

async function main() {
  const apollo = new ApolloService();
  const prospeo = new ProspeoService();

  const company = await apollo.enrichCompany("stripe.com");

  console.log("\nSeed Company:");
  console.table([company]);

  const similarCompanies = await apollo.findSimilarCompanies(company);

  console.log("\nSimilar Companies:");
  console.table(similarCompanies);

  const prospects = await prospeo.findDecisionMakers(company.domain);

  console.log("\nProspects:");

  console.table(
    prospects.map((item) => ({
      id: item.id,
      name: item.fullName,
      title: item.title,
      seniority: item.seniority,
      company: item.company,
    })),
  );

  const eazyreach = new EazyreachService();

  const firstProspect = prospects[0];

  const email = await eazyreach.findEmail(firstProspect.linkedinUrl);

  console.log({
    name: firstProspect.fullName,
    email,
  });
}

main().catch(console.error);
