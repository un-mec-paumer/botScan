import { Command } from "../Command";
import { Client, ChatInputCommandInteraction } from "discord.js";

export const Site: Command = {
    name: "site",
    description: "site of scan",
    descriptionLocalizations: {
        fr: "site de scan"
    },
    // type: "CHAT_INPUT",
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        // console.log(interaction.options.get("site")?.value);
        interaction.followUp({
            ephemeral: true,
            content: "https://anime-sama.si/"
        });
    },
};