import { Client, Interaction, ChatInputCommandInteraction } from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    // handle slash command here
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        await interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
};
