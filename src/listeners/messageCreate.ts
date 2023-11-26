import { Client } from "discord.js";
import dotenv from "dotenv";
import feur from "../data/feur.json";
import { randomInt } from "crypto";

function feurIsIn(message:string): boolean {
    let res = false;
    feur.forEach((feur) => {
        let regex = new RegExp(`(${feur})`, "g");
        //console.log(regex);
        if(regex.test(message)) res = true;
    });
    return res;
}

export default (client: Client): void => {
    dotenv.config();
    client.on("messageCreate", async (message) => {
        
        // console.log(message);
        // console.log("message est ", message.content);
        if(message.author.bot) return;

        if(feurIsIn(message.content.toLowerCase().trim())) {
            //console.log("feur");
            if (message.author.id === process.env.DEV!) return;
            
            message.reply("feur");
            message.react("🇫");
            message.react("🇪");
            message.react("🇺");
            message.react("🇷");

            message.author.send("ca t'apprendra a dire quoi");
            
            return;
        }

        if(message.content.toLowerCase().split('').join("") === "oui"){
            if (message.author.id === process.env.DEV!) return;
            message.reply("fi");
            return;
        }

        if(message.content.toLowerCase().split('').join("") === "non" || message.content.toLowerCase().split('').join("") === "nan"){
            if (message.author.id === process.env.DEV!) return;
            message.reply("bril");
            return;
        }

        if(message.content.toLowerCase().trim().startsWith("$harcelement ")){
            let args = message.content.toLowerCase().trim().split(" ");
            //console.log(args);
            args.shift();
            //console.log(args);
            let harcele = args.join(" ");
            harcele = String(harcele.replace("<@", "").replace(">", ""));
            
            // console.log(harcele);
            client.users.fetch(harcele).then((user) => {
                for(let i = 0; i < 30; i++) user.send("oui tu va recevoir 30 messages de harcelement :)");
            });
            //console.log(harcele);
            //client.user?.fetch("");
        }
        
        
    });

    console.log("Bot can listen to messages");
};