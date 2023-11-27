import { Client } from "discord.js";
import dotenv from "dotenv";
import feur from "../data/feur.json";
import { randomInt } from "crypto";

function tabin(message:string, tab:Array<string>): boolean {
    let res = false;
    tab.forEach((element) => {
        let regex = new RegExp(`(${element})`, "g");
        //console.log(regex);
        if(regex.test(message)) res = true;
    });
    return res;
}

export default (client: Client): void => {
    dotenv.config();
    client.on("messageCreate", async (message) => {
        
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

        // console.log(message);
        // console.log("message est ", message.content);
        if(message.author.bot || message.author.id === process.env.DEV!) return;
        if(randomInt(0, 100) === 0) message.reply("bonjour ses est une fonctionnalité qui a été demander pas @tani_soe (je ne suis pas responsable)");
        if(tabin(message.content.toLowerCase().trim(), feur)) {
            //console.log("feur");
            
            message.reply("feur");
            message.react("🇫");
            message.react("🇪");
            message.react("🇺");
            message.react("🇷");

            message.author.send("ca t'apprendra a dire quoi");
            
            return;
        }

        if(tabin(message.content.toLowerCase().split('').join(""), ["oui", "ouais", "ouai", "oué", "oue"])){
            message.reply("fi");
            return;
        }

        if(tabin(message.content.toLowerCase().split('').join(""), ["non", "nan", "nann", "nannn", "nannnn"])){
            message.reply("bril");
            return;
        }

    });        

    console.log("Bot can listen to messages");
};