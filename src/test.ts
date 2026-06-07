import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

async function test() {
  console.log({
    clientId: process.env.EAZYREACH_CLIENT_ID,
    clientSecret: process.env.EAZYREACH_CLIENT_SECRET,
  });

  try {
    const response = await axios.post(
      "https://api.superflow.run/b2b/createAuthToken/",
      {
        clientId: process.env.EAZYREACH_CLIENT_ID,
        clientSecret: process.env.EAZYREACH_CLIENT_SECRET,
      }
    );

    console.log(response.data);
  } catch (err: any) {
    console.log(err.response?.status);
    console.log(err.response?.data);
  }
}

test();