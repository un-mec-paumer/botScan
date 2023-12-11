import { Command } from "../Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";

export const Site: Command = {
    name: "site",
    description: "site of scan",
    descriptionLocalizations: {
        fr: "site de scan"
    },
    // type: "CHAT_INPUT",
    run: async (client: Client, interaction: CommandInteraction) => {
        interaction.followUp({
            ephemeral: true,
            content: "https://fr-scan.com/"
        });
    }
};