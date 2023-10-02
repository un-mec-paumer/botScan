import { Command } from "src/Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import mangas from "../data/mangas.json";

export const ListeManga: Command = {
    name: "maliste",
    description: "Liste des mangas suivis",
    // type: "CHAT_INPUT",
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        // console.log("Hello world!");
        let liste = "";
        let nom = "";
        mangas.forEach(manga => {
            nom = manga.name.replaceAll("-", " ");
            liste += `- le manga ${nom} est au chapitre ${manga.chapitre}\n`;
        });
        interaction.followUp({
            ephemeral: true,
            content: liste
        });
    }
};