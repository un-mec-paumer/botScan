"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (client) {
    client.on("messageCreate", function (message) {
        // console.log(message);
        // console.log("message est ", message.content);
        if (message.author.bot)
            return;
        if (message.content.toLowerCase().trim().endsWith("quoi")) {
            message.reply("feur");
        }
        if (message.content.toLowerCase().trim().startsWith("$harcelement ")) {
            var args_1 = message.content.toLowerCase().trim().split(" ");
            //console.log(args);
            args_1.shift();
            //console.log(args);
            var harcele = args_1.join(" ");
            harcele = String(harcele.replace("<@", "").replace(">", ""));
            client.users.fetch(harcele).then(function (user) {
                for (var i = 0; i < 10; i++)
                    user.send("Tu es harcelé par quelqu'un : " + args_1.join(" "));
            });
            //console.log(harcele);
            //client.user?.fetch("");
        }
    });
    console.log("Bot can listen to messages");
});
