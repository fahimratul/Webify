import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { EmailClient } from "@azure/communication-email";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
if (!connectionString) {
    console.error('❌ COMMUNICATION_SERVICES_CONNECTION_STRING is not set in backend/.env');
}
const client = connectionString ? new EmailClient(connectionString) : null;

async function mailSender(mailcontent) {
    const emailMessage = {
        senderAddress: "DoNotReply@ec8b80ea-24df-4c00-8d23-40bd4e223dfe.azurecomm.net",
        content: {
            subject: mailcontent.subject,
            plainText: mailcontent.text,
            html: mailcontent.html,
        },
        recipients: {
            to: [{ address: mailcontent.to }],
        },

    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
}

export { mailSender };