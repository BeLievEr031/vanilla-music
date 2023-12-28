import { Client, Databases,ID,Query,Permission} from "appwrite";
import { PROJECT_ID } from "../utils/secret";
const client = new Client();

const databases = new Databases(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);



export { client, databases,ID,Query,Permission };

