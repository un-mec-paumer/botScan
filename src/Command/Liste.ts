import { Command } from "../Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { BDD } from "../supabase";

export const Liste: Command = {
    name: "liste",
    description: "Liste of all mangas",

    run: async (client: Client, interaction: CommandInteraction) => {
        BDD.getMangas().then((mangas) => {
            let liste = "";
            mangas?.forEach((manga) => {
                liste += manga.name_manga.replaceAll("-", " ") + "\n";
            });
            interaction.followUp({
                ephemeral: true,
                content: liste
            });
        });
    }
};