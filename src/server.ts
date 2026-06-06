import { ApolloService } from "./services/apollo/apollo.service";
import { ProspeoService } from "./services/prospeo/prospeo.service";

async function main() {
  const apollo = new ApolloService();
  const prospeo = new ProspeoService();

  const company =
    await apollo.enrichCompany(
      "stripe.com"
    );

  console.log("\nSeed Company:");
  console.table([company]);

  const similarCompanies =
    await apollo.findSimilarCompanies(
      company
    );

  console.log(
    "\nSimilar Companies:"
  );
  console.table(similarCompanies);

  const prospects =
    await prospeo.findDecisionMakers(
      company.domain
    );

  console.log("\nProspects:");

  console.table(
    prospects.map((item) => ({
      id: item.id,
      name: item.fullName,
      title: item.title,
      seniority:
        item.seniority,
      company: item.company,
    }))
  );
}

main().catch(console.error);