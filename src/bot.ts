import { Client, User, GatewayIntentBits as Intents} from "discord.js";
import * as dotenv from 'dotenv'
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import { sauvegarder, finderAll } from "./function";
import mangas from "./data/mangas.json";

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

process.on("SIGINT", () => {
    console.log("saving data...");
    sauvegarder(JSON.stringify(mangas), "./src/data/mangas.json");
    console.log("Bot is stopping...");
    client.destroy();
    console.log("Bot is stopped");
    process.exit(0);
});


console.log(process.env.TOKEN);
client.login(process.env.TOKEN);
//const interval = setInterval(finderAll, 1000 * 60 * 60, client);
