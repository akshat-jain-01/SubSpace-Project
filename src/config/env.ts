import dotenv from 'dotenv';

dotenv.config();    

export const config = {
    apolloApiKey:  process.env.APOLLO_API_KEY!,
}