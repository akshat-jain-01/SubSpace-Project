import { ApolloService } from "./services/apollo/apollo.service";

async function main() {

  const apollo = new ApolloService();

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

  console.log("\nSimilar Companies:");
  console.table(similarCompanies);
}

main().catch(console.error);