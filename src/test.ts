// import dotenv from "dotenv";
// dotenv.config();

import { BrevoService } from "./services/brevo/brevo.service";

// import axios from "axios";

async function test() {
  //   console.log({
  //     clientId: process.env.EAZYREACH_CLIENT_ID,
  //     clientSecret: process.env.EAZYREACH_CLIENT_SECRET,
  //   });

  //   try {
  //     const response = await axios.post(
  //       "https://api.superflow.run/b2b/createAuthToken/",
  //       {
  //         clientId: process.env.EAZYREACH_CLIENT_ID,
  //         clientSecret: process.env.EAZYREACH_CLIENT_SECRET,
  //       }
  //     );

  //     console.log(response.data);
  //   } catch (err: any) {
  //     console.log(err.response?.status);
  //     console.log(err.response?.data);
  //   }

  const brevo = new BrevoService();

  await brevo.sendEmail("akshatjainkht01@gmail.com", "Akshat Jain");

  console.log("Test email sent");
}

test();
