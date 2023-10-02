import { Client } from "discord.js";
import token from "./data/token.json";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";

console.log("Bot is starting...");

const client = new Client({
    intents: []
});
//console.log(token.token);
ready(client);
interactionCreate(client);
client.login(token.token);

//console.log(client);