import { Client, Account} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6531782243c6330ec52f')

export const account = new Account(client);
export { ID } from 'appwrite';