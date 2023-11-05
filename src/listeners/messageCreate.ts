import { Client } from "discord.js";

export default (client: Client): void => {
    client.on("messageCreate", (message) => {
        
        // console.log(message);
        // console.log("message est ", message.content);
        if(message.author.bot) return;
        if (message.content.toLowerCase().trim().endsWith("quoi")) {
            message.reply("feur");
        }

        if(message.content.toLowerCase().trim().startsWith("$harcelement ")){
            let args = message.content.toLowerCase().trim().split(" ");
            //console.log(args);
            args.shift();
            //console.log(args);
            let harcele = args.join(" ");
            harcele = String(harcele.replace("<@", "").replace(">", ""));
            

            client.users.fetch(harcele).then((user) => {
                for(let i = 0; i < 10; i++) user.send("Tu es harcelé par quelqu'un : " + args.join(" "));
            });
            //console.log(harcele);
            //client.user?.fetch("");
        }
        
        
    });

    console.log("Bot can listen to messages");
};