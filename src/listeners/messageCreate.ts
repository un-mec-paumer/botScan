import { Client } from "discord.js";

export default (client: Client): void => {
    client.on("messageCreate", (message) => {
        
        // console.log(message);
        // console.log("message est ", message.content);
        if(message.author.bot) return;
        if (message.content.toLowerCase().includes("quoi")) {
            message.reply("feur");
        }
        
    });

    console.log("Bot can listen to messages");
};