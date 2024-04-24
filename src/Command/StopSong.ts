import { Command } from '../Command';
import { CommandInteraction, Client } from 'discord.js';

export const StopSong: Command = {
    name: 'stop',
    description: 'Stop the current song',
    descriptionLocalizations: {
        fr: 'Arrête la musique actuelle'
    },

    run: async (client: Client, interaction: CommandInteraction) => {
        const voiceChannelBot = (await interaction.guild?.members.fetchMe())?.voice.channel!;

        if (!voiceChannelBot) {
            return await interaction.followUp({
                content: 'The bot is not in a voice channel',
                ephemeral: true
            });
        }

        await interaction.client.player.destroy();

        await interaction.followUp({
            content: 'The music has been stopped',
            ephemeral: true
        });
    }
}