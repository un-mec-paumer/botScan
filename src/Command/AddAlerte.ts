import { Command } from "../Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { BDD } from "../supabase";

export const AddAlerte: Command = {
    name: "addalerte",
    description: "Add an alerte when a new chapter is out for a manga",
    descriptionLocalizations: {
        fr: "Ajoute une alerte quand un nouveau chapitre d'un manga est sorti"
    },
    // type: "CHAT_INPUT"
    options: [
        {
            name: "name",
            description: "Name of the manga",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
            descriptionLocalizations: {
                fr: "Nom du manga"
            },
            
        },
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        let name = interaction.options.get("name")?.value;
        name = name?.toString().toLowerCase().replaceAll(" ", "-");
        BDD.getManga(name!).then((manga) => {
            // console.log(manga);
            if (manga!.length == 0) {
                interaction.followUp({
                    ephemeral: true,
                    content: "Manga non trouvé"
                });
                return;
            }
            BDD.getUser(interaction.user.id).then((user) => {
                
                if(user?.length === 0){
                    const useravatar = interaction.user.avatarURL();    
                    BDD.addUser(interaction.user.id, interaction.user.username, useravatar!).then(() => {
                        BDD.addLien(manga![0].id_manga, interaction.user.id).then(() => {
                            interaction.followUp({
                                ephemeral: true,
                                content: "vous avez été ajouté à la liste des personnes à prévenir de " + manga![0].name_manga.replaceAll("-", " ")
                            });
                        });
                    });
                    return;
                }
            });
            BDD.getLien(manga![0].id_manga).then((user) => {
                // console.log(user, interaction.user.id);
                if(user!.find(id_user => id_user.id_user == interaction.user.id) !== undefined){
                    interaction.followUp({
                        ephemeral: true,
                        content: "tu est déjà dans la liste des personnes à prévenir"
                    });
                }
                else{
                    BDD.addLien(manga![0].id_manga, interaction.user.id).then(() => {
                        interaction.followUp({
                            ephemeral: true,
                            content: "vous avez été ajouté à la liste des personnes à prévenir de " + manga![0].name_manga.replaceAll("-", " ")
                        });
                    });
                }
            });
        })        
    }
};