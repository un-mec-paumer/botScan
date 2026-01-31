import { Command } from "../Command";
import { Client, ChatInputCommandInteraction } from "discord.js";
import { animeSamaUrl } from "../variables";

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
            content: `${animeSamaUrl}/` // Idk if the / is important or not
        });
    },
};