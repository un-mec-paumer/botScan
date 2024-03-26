import { Command } from "../Command";
import { CommandInteraction, Client } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";

export const ConnexionVoc: Command = {
    name: "connexionvoc",
    description: "Connexion in a vocal",
    descriptionLocalizations: {
        fr: "Connexion au vocal"
    },
    // type: "CHAT_INPUT",
    run: async (client: Client, interaction: CommandInteraction) => {
        const connection = getVoiceConnection("1039531159866060830");
        if (connection) {
            interaction.followUp({
                ephemeral: true,
                content: "I'm already connected to a voice channel!"
            });
            return;
        }
    }
};