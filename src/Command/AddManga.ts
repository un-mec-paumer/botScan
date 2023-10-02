import { Command } from "src/Command";
import { CommandInteraction, Client } from "discord.js";

export const AddManga: Command = {
    name: "addmanga",
    description: "Add a manga to the scrap bot",
    // type: "CHAT_INPUT",
    run: async (client: Client, interaction: CommandInteraction) => {
        console.log("Hello world!");
        await interaction.followUp({
            ephemeral: true,
            content: "Hello world!"
        })
        //await interaction.reply("Hello world!");
    }
};