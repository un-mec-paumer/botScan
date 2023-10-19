import { Command } from "src/Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { BDD } from "../supabase";

export const SupAlerte: Command = {
    name: "supalerte",
    description: "sup an alerte when a new chapter is out for a manga",
    // type: "CHAT_INPUT",
    options: [
        {
            name: "name",
            description: "Name of the manga",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        let name = interaction.options.get("name")?.value;
        name = name?.toString().toLowerCase().replaceAll(" ", "-");

        BDD.getManga(name!).then((manga) => {
            if(manga!.length === 0){
                interaction.followUp({
                    ephemeral: true,
                    content: "Manga non trouvé"
                });
                return;
            }
            BDD.supprimerLien(manga![0].id_manga, interaction.user.id).then((error) => {
                if(error){
                    interaction.followUp({
                        ephemeral: true,
                        content: "vous n'êtes pas dans la liste des personnes à prévenir de " + manga![0].name_manga.replaceAll("-", " ")
                    });
                    return;
                }
                interaction.followUp({
                    ephemeral: true,
                    content: "vous avez été supprimé de la liste des personnes à prévenir de " + manga![0].name_manga.replaceAll("-", " ")
                });
            });
        });
        
    }
};