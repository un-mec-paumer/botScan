import { Client } from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        await client.application.commands.set(Commands);

        // await client.application.commands.fetch().then((commands) => {
        //     //console.log(commands);
        //     commands.forEach((command) => {
        //         console.log(command);
        //         //console.log(command.options);
        //     });
        // });
        console.log(`${client.user.username} is online`);
    });
};