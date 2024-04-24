import { Command } from "../Command";
import { CommandInteraction, Client, ApplicationCommandOptionType, GuildMember } from "discord.js";

export const PlaySong: Command = {
    name: "play",
    description: "play a song in a vocal channel",
    descriptionLocalizations: {
        fr: "joue une musique dans un salon vocal"
    },
    options: [
        {
            name: "song",
            description: "Name of the song",
            type: ApplicationCommandOptionType.String,
            required: true,
            descriptionLocalizations: {
                fr: "Nom de la musique"
            },
        }
    
    ],
    // type: "CHAT_INPUT",
    run: async (client: Client, interaction: CommandInteraction) => {

        const nameSong = interaction.options.get("song")?.value as string;
        const userVoiceChannel = (interaction.member as GuildMember)?.voice.channel!;
        const voiceChannelBot = (await interaction.guild?.members.fetchMe())?.voice.channel!;
        // console.log(nameSong);
        try {
            if (!userVoiceChannel) {
                return await interaction.followUp({
                    content: "You need to be in a voice channel to play music!",
                    ephemeral: true
                });
            }
            if (voiceChannelBot && userVoiceChannel.id !== voiceChannelBot.id) {
                return await interaction.followUp({
                    content: "you are not in the same voice channel as the bot",
                    ephemeral: true
                });
            }

            // console.log(userVoiceChannel);

            const { track } = await interaction.client.player.play(userVoiceChannel, nameSong, {
                requestedBy: interaction.user,
                nodeOptions: {
                    metadata: interaction,
                    volume: 70,
                    leaveOnEmpty: true,
                    leaveOnEnd: true,
                    selfDeaf: true
                }
            });

            await interaction.followUp({
                content: `Playing ${track.title}, during ${track.duration} seconds`,
                ephemeral: true
            });

        } catch (error) {
            return interaction.followUp({
                content: "problem with the song"
            });
        }

    }
};