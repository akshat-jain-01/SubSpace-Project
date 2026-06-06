import { logger } from "./logger";

export async function retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3
): Promise<T> {

    let error: any;

    for (let i = 0; i < maxRetries; i++) {

        try {
            return await fn();
        } 

        catch (err: any) {
            error = err;
            if (i === maxRetries - 1) {
                throw error;
            }

            // Wait for some time before retrying
            logger.info(`Attempt ${i + 1} failed. Retrying in 1 second...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    throw error;
}