import { Command } from "../Command";
import { Client, ChatInputCommandInteraction } from "discord.js";
import { getEmbedListeMangas } from "../function";
import { getMangas } from "../service/mangasApi";

export const Liste: Command = {
    name: "liste",
    description: "Liste of all mangas",
    descriptionLocalizations: {
        fr: "Liste de tout les mangas"
    },

    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        // interaction.followUp({ content: "Voici la liste de tous les mangas disponibles avec le bot actuellement" });
        const mangas = await getMangas();
        
        await getEmbedListeMangas(mangas!, interaction);
    }
};
