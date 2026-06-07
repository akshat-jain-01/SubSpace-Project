import dotenv from "dotenv";

dotenv.config();

export const config = {
  apolloApiKey: process.env.APOLLO_API_KEY!,
  prospeoApiKey: process.env.PROSPEO_API_KEY!,
  eazyreachClientId: process.env.EAZYREACH_CLIENT_ID!,
  eazyreachClientSecret: process.env.EAZYREACH_CLIENT_SECRET!,
};
