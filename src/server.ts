import { ApolloService } from "./services/apollo/apollo.service";
import { ProspeoService } from "./services/prospeo/prospeo.service";
import { BrevoService } from "./services/brevo/brevo.service";
import { askQuestion } from "./utils/askQuestion";
import { logger } from "./utils/logger";
import { retry } from "./utils/retry";
import { Person } from "./types/person";

async function main() {
  const apollo = new ApolloService();
  const prospeo = new ProspeoService();
  const brevo = new BrevoService();

  logger.info("Starting campaign workflow...");

  // STEP 1: Domain Input
  const domain = await askQuestion("\nEnter company domain: ");

  // STEP 2: Company Enrichment
  logger.info(`Fetching company data for ${domain}...`);

  const company = await apollo.enrichCompany(domain);

  logger.success(`Company found: ${company.name}`);

  console.log("\nSeed Company:");

  console.table([company]);

  // STEP 3: Similar Companies
  logger.info("Finding similar companies...");

  const similarCompanies = await apollo.findSimilarCompanies(company);

  logger.success(`Found ${similarCompanies.length} similar companies`);

  console.log("\nSimilar Companies:");

  console.table(similarCompanies);

  // STEP 4: Prospects
  logger.info("Finding decision makers...");

  const prospects = await prospeo.findDecisionMakers(company.domain);

  logger.success(`Found ${prospects.length} prospects`);

  console.log("\nProspects:");

  console.table(
    prospects.map((item: any) => ({
      id: item.id,
      name: item.fullName,
      title: item.title,
      seniority: item.seniority,
      company: item.company,
      email: item.email,
      emailStatus: item.emailStatus,
    })),
  );

  // STEP 5: Filter Valid Emails
  const validProspects = prospects.filter(
    (prospect): prospect is Person & { email: string } => !!prospect.email,
  );

  console.log("\n===== CAMPAIGN SUMMARY =====");

  console.table(
    validProspects.map((prospect: any) => ({
      name: prospect.fullName,
      title: prospect.title,
      email: prospect.email,
      status: prospect.emailStatus,
    })),
  );

  logger.info(`Total Prospects: ${prospects.length}`);

  logger.info(`Valid Emails: ${validProspects.length}`);

  if (validProspects.length === 0) {
    logger.error("No valid emails found.");

    process.exit(0);
  }

  // STEP 6: User Confirmation
  const answer = await askQuestion("\nSend emails? (y/n): ");

  if (answer.toLowerCase() !== "y") {
    logger.info("Campaign cancelled by user.");

    process.exit(0);
  }

  // STEP 7: Email Campaign
  logger.info("Starting email campaign...");

  let sentCount = 0;
  let failedCount = 0;

  for (const prospect of validProspects) {
    try {
      await retry(() => brevo.sendEmail(prospect.email, prospect.fullName));

      sentCount++;

      logger.success(`Email sent to ${prospect.fullName}`);

      // Rate Limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error: any) {
      failedCount++;

      logger.error(`Failed for ${prospect.fullName}`);
    }
  }

  logger.success(
    `Campaign completed. Sent: ${sentCount}, Failed: ${failedCount}`,
  );
}

main().catch((error) => {
  logger.error(error.message);
});




// import { ApolloService } from "./services/apollo/apollo.service";
// import { EazyreachService } from "./services/eazyreach/eazyreach.service";
// import { ProspeoService } from "./services/prospeo/prospeo.service";
// import { askQuestion } from "./utils/askQuestion";

// async function main() {
//   const apollo = new ApolloService();
//   const prospeo = new ProspeoService();

//   // STEP 1: Seed Company
//   const company = await apollo.enrichCompany("stripe.com");

//   console.log("\nSeed Company:");
//   console.table([company]);

//   // STEP 2: Similar Companies
//   const similarCompanies = await apollo.findSimilarCompanies(company);

//   console.log("\nSimilar Companies:");
//   console.table(similarCompanies);

//   // STEP 3: Decision Makers
//   const prospects = await prospeo.findDecisionMakers(company.domain);

//   console.log("\nProspects:");

//   console.table(
//     prospects.map((item) => ({
//       id: item.id,
//       name: item.fullName,
//       title: item.title,
//       seniority: item.seniority,
//       company: item.company,
//     })),
//   );

//   // // STEP 4: Email Enrichment
//   // const eazyreach = new EazyreachService();

//   // console.log("\nEnriching Emails...");

//   // const enrichedProspects = await Promise.all(
//   //   prospects.map(async (prospect) => ({
//   //     ...prospect,
//   //     email: await eazyreach.findEmail(prospect.linkedinUrl),
//   //   })),
//   // );

//   // // Remove prospects with no email
//   // const validProspects = enrichedProspects.filter((prospect) => prospect.email);

//   // // STEP 5: Campaign Summary
//   // console.log("\n===== CAMPAIGN SUMMARY =====");

//   // console.table(
//   //   validProspects.map((prospect) => ({
//   //     name: prospect.fullName,
//   //     title: prospect.title,
//   //     email: prospect.email,
//   //   })),
//   // );

//   // console.log(`\nTotal Emails Found: ${validProspects.length}`);

//   // STEP 6: User Confirmation
//   const answer = await askQuestion("\nSend emails? (y/n): ");

//   if (answer.toLowerCase() !== "y") {
//     console.log("\nCampaign cancelled by user.");

//     process.exit(0);
//   }

//   // STEP 7: Brevo will come here
//   console.log("\nStarting email campaign...");

//   // await brevo.sendBulkEmails(validProspects);

//   console.log("\nEmail campaign completed.");
// }

// main().catch(console.error);
