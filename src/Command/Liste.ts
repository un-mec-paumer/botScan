import { Command } from "../Command";
import { CommandInteraction, Client } from "discord.js";
import { BDD } from "../supabase";
import { getEmbedListeMangas } from "../function";

export const Liste: Command = {
    name: "liste",
    description: "Liste of all mangas",
    descriptionLocalizations: {
        fr: "Liste de tout les mangas"
    },

    run: async (client: Client, interaction: CommandInteraction) => {
        interaction.followUp({ content: "Voici la liste de tous les mangas disponibles avec le bot actuellement" });
        const mangas = await BDD.getMangas();
        
        getEmbedListeMangas(mangas!, interaction);
    }
};
