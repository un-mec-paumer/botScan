import { Client, User, GatewayIntentBits as Intents} from "discord.js";
import token from "./data/token.json";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import { finderAll } from "./chercheur";


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
//console.log(token.token);

ready(client);
interactionCreate(client);
messageCreate(client);

// client.addListener("messageCreate", (message) => {
//     console.log(message);
// });



client.login(token.token);

// client.on("ready", () => {
//     console.log("Bot is ready");
//     // finderAll(client);
// });



//console.log(client);
//const interval = setInterval(finderAll, 1000 * 60, client);
