import { Command } from "src/Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { BDD } from "../supabase";

export const SupManga: Command = {
    name: "supmanga",
    description: "Supprime un manga de la liste",
    // type: "CHAT_INPUT",
    options: [
        {
            name: "name",
            description: "Nom du manga",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        // console.log("Hello world!");

        //console.log(interaction.options);
        let nom = interaction.options.get("name")?.value;
        nom = nom?.toString().replaceAll(" ", "-").toLowerCase();
        
        BDD.getManga(nom as string).then((manga) => {
            if(manga!.length === 0){
                interaction.followUp({
                    ephemeral: true,
                    content: "Le manga n'existe pas"
                });
            }
            else{
                BDD.getLien(manga![0].id_manga).then((user) => {
                    user!.forEach(element => {
                        BDD.supprimerLien(manga![0].id_manga, element.id_user)
                    });
                }).then(() => {
                    BDD.supprimerManga(manga![0].name_manga);
                });
            }
        });
    }
};