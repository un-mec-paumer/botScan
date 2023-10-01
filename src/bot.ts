import { Client } from "discord.js";
import token from "../token.json";
import ready from "./listeners/ready";

console.log("Bot is starting...");

const client = new Client({
    intents: []
});
console.log(token.token);
ready(client);
client.login(token.token);

//console.log(client);