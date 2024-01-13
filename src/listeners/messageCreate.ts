import { Client, EmbedBuilder} from "discord.js";
import dotenv from "dotenv";
import { randomInt } from "crypto";
import { tabin } from "../function";

export default (client: Client): void => {
    dotenv.config();
    client.on("messageCreate", async (message) => {
        
        if(message.content.toLowerCase().trim().startsWith("$harcelement ")){
            let args = message.content.toLowerCase().trim().split(" ");
            // console.log(args);
            args.shift();
            //console.log(args);
            //* String() probablement inutile, à tester
            const harcele = args.join(" ").replace("<@", "").replace(">", "");
            // const harcele = String(args.join(" ").replace("<@", "").replace(">", ""));
            
            // console.log(harcele);
            const userDiscord = await client.users.fetch(harcele)
            for(let i = 0; i < 30; i++) userDiscord.send("Oui tu vas recevoir 30 messages de harcèlement :) ||(cheh)||");
            //console.log(harcele);
            //client.userDiscord?.fetch("");
        }

        // console.log(message);
        // console.log("message est ", message.content);
        return;
        if(message.author.bot || /*message.author.id === process.env.DEV! ||*/ message.content[0] === '$') return;
        if(randomInt(0, 100) === 3) message.reply("Bonjour c'est une fonctionnalité (de merde) qui a été demandée par @tani_soe (je ne suis pas responsable)");
        const messageContent = message.content.toLowerCase().replaceAll("?","").replaceAll("!","").replaceAll(".","").trim().split(" ");
        const end = messageContent[messageContent.length - 1];
        // console.log(messageContent);
        // console.log(end);

        if(messageContent.filter((element) => {return element === "oui"}).length === 2) {
            message.reply(`**AVEC SONT GROS TAXI !** \nhttps://youtu.be/6vlY1vdkPf4`);
            return;
        }
        
        if(tabin(end, ["quoi","koi","koa","quoa","koua", "qu oi", "qu oa", "k oi", "k oa"])) {
            //console.log("feur")
            
            //message.reply("feur");
            message.react("🇫");
            message.react("🇪");
            message.react("🇺");
            message.react("🇷");
            const rep = new EmbedBuilder()
                .setTitle("feur")
                .setImage("https://media.tenor.com/SVRGZaisSqsAAAAC/quoifeur-feur.gif");
            message.reply({embeds: [rep]});
            //message.author.send("ça t'apprendras à dire quoi");
            
            return;
        }

        if(tabin(end, ["oui", "ou i"])) {
            // message.reply("fi");
            const rep = new EmbedBuilder()
                .setTitle("fi")
                .setImage("https://i.redd.it/iu7vpn5lbe861.jpg");
            message.reply({embeds: [rep]});
            return;
        }

        if(tabin(end, ["non", "no n"])) {
            // message.reply("bril");
            const rep = new EmbedBuilder()
                .setTitle("bril")
                .setImage("https://urlr.me/JkNWM");
            message.reply({embeds: [rep]});
            return;
        }

        if(tabin(end, ["dimitriou"])) {
            message.reply("mitriou");
            return;
        }

        if(tabin(end, ["qui", "ki", "qu i", "q u i"])) {
            message.react("🇨");
            message.react("🇭");
            message.react("🇪");

            const rep = new EmbedBuilder()
                .setTitle("che lorraine")
                .setImage("https://assets.afcdn.com/recipe/20221010/135915_w1024h1024c1cx999cy749cxt0cyt0cxb1999cyb1499.webp");
            message.reply({embeds: [rep]});
            return;
        }

    });        

    console.log("Bot can listen to messages");
};
