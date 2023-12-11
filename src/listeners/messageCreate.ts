import { Client } from "discord.js";
import dotenv from "dotenv";
import { randomInt } from "crypto";

function tabin(message:string, tab:Array<string>): boolean {
    return tab.filter((element) => {return element === message}).length === 1 ? true : false;
}

export default (client: Client): void => {
    dotenv.config();
    client.on("messageCreate", async (message) => {
        
        if(message.content.toLowerCase().trim().startsWith("$harcelement ")){
            let args = message.content.toLowerCase().trim().split(" ");
            // console.log(args);
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
        //if(message.author.bot || message.author.id === process.env.DEV! || message.content[0] === '$') return;
        if(randomInt(0, 100) === 3) message.reply("Bonjour c'est une fonctionnalité (de merde) qui a été demandée par @tani_soe (je ne suis pas responsable)");
        const messageContent = message.content.toLowerCase().replaceAll("?","").replaceAll("!","").replaceAll(".","").trim().split(" ")
        const end = messageContent[messageContent.length - 1];
        // console.log(messageContent);
        // console.log(end);

        if(messageContent.filter((element) => {return element === "oui"}).length === 2){
            message.reply("https://youtu.be/6vlY1vdkPf4?si=xrf1H11MG2aRamdB");
            return;
        }
        
        if(tabin(end, ["quoi","koi","koa","quoa","koua", "qu oi", "qu oa", "k oi", "k oa"])) {
            //console.log("feur")
            
            message.reply("feur");
            message.react("🇫");
            message.react("🇪");
            message.react("🇺");
            message.react("🇷");

            //message.author.send("ca t'apprendra a dire quoi");
            
            return;
        }

        if(tabin(end, ["oui", "ouais", "ouai", "oué", "oue", "ou i", "ou ai", "ou é", "ou e"])){
            message.reply("fi");
            return;
        }

        if(tabin(end, ["non", "nan", "no n", "na n"])){
            message.reply("bril");
            return;
        }

        if(tabin(end, ["dimitriou"])){
            message.reply("mitriou");
            return;
        }

    });        

    console.log("Bot can listen to messages");
};