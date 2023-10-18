import { Command } from "src/Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { BDD } from "../supabase";

export const ListeManga: Command = {
    name: "maliste",
    description: "Liste des mangas suivis",
    // type: "CHAT_INPUT",
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        // console.log("Hello world!");
        let liste = "";
        let nom = "";
        console.log(interaction.user.id);

        BDD.getMangas().then((mangas) => {
            console.log("mangas", mangas);
            mangas!.forEach(manga => {
                nom = manga.name_manga.replaceAll("-", " ");
                liste += `- le manga ${nom} est au chapitre ${manga.chapitre_manga}\n`;
            });
            interaction.followUp({
                ephemeral: true,
                content: liste
            });
        });   
    }
};