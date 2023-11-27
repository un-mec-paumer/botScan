import { Command } from "../Command";
import { CommandInteraction, Client, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { BDD } from "../supabase";

export const Liste: Command = {
    name: "liste",
    description: "Liste of all mangas",

    run: async (client: Client, interaction: CommandInteraction) => {
        interaction.followUp({ content: "Voici la liste de tout les manga disponible avec le bot actuellement" });
        BDD.getMangas().then((mangas) => {
            //let liste = "";
            mangas?.forEach(async(manga) => {
                const nom = manga.name_manga?.replaceAll("-", " ") ?? "";
                const synopsis = manga.synopsis ?? "";
                const img = await BDD.getImgFromTest(manga.name_manga!).then((value) => { return value?.signedUrl ?? ""; });


                const embed = new EmbedBuilder()
                    .setTitle(nom)
                    .setDescription(synopsis.split(" ").slice(0, 50).join(" ") + "...")
                    .setImage(img);

                interaction.followUp({ embeds: [embed] });
                
            });
        });
    }
};