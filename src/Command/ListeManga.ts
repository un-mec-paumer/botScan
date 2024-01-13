import { Command } from "../Command";
import { CommandInteraction, Client } from "discord.js";
import { BDD } from "../supabase";
import { getEmbedListeMangas } from "../function";


export const ListeManga: Command = {
    name: "maliste",
    description: "List of all mangas",
    descriptionLocalizations: {
        fr: "Liste des mangas suivis"
    },
    // type: "CHAT_INPUT",
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        // console.log("Hello world!");
        // console.log(interaction.user.id);

        const mangas = await BDD.getMangaBylien(interaction.user.id);
        
        // console.log("mangas", mangas);
        interaction.followUp({ content: "Voici la liste des mangas que tu suis" });

        await getEmbedListeMangas(mangas!, interaction);
    }
};
