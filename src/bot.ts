import { Client, GatewayIntentBits as Intents} from "discord.js";
import * as dotenv from 'dotenv'
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import { finderAll } from "./function";

dotenv.config()

console.log("Bot is starting...");

const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMessages,
        Intents.DirectMessages,
        // Intents.GuildMembers,
        Intents.MessageContent,
    ]
});

ready(client);
interactionCreate(client);
messageCreate(client);

// console.log(process.env.TOKEN);
client.login(process.env.TOKEN);
const interval = setInterval(finderAll, 1000 * 60 * 10, client);
