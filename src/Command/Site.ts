import { Command } from "../Command";
import { CommandInteraction, Client, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandOptionsOnlyBuilder, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandUserOption } from "discord.js";

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
            content: "https://anime-sama.fr/"
        });
    },
};
