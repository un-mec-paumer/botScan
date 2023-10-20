import { Command } from "src/Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { BDD } from "../supabase";
// import mangas from "../data/mangas.json";
// import { sauvegarder } from "../function";

export const AddManga: Command = {
    name: "addmanga",
    description: "Add a manga to the scrap bot",
    // type: "CHAT_INPUT",
    options: [
        {
            name: "name",
            description: "Name of the manga",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        },
        {
            name: "chapitre",
            description: "numero du dernier chapitre",
            type: ApplicationCommandOptionType.Number,
            required: true,
            autocomplete: true
        },
        {
            name: "page",
            description: "le manga est t'il sur plusieurs pages ou non",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        // console.log("Hello world!");

        let nom = interaction.options.get("name")?.value;
        nom = nom?.toString().toLowerCase().replaceAll(" ", "-");
        //console.log(mangas.find(manga => manga.name === nom));

        BDD.getManga(nom as string).then((manga) => {
            if(manga!.length === 1){
                BDD.getUser(interaction.user.id).then((user) => {
                    if(user?.length === 1){
                        BDD.getLien(manga![0].id_manga).then((user) => {
                            if(user!.find(id_user => id_user.id_user == interaction.user.id) !== undefined){
                                interaction.followUp({
                                    ephemeral: true,
                                    content: "tu est déjà dans la liste des personnes à prévenir"
                                });
                            }
                            else{
                                interaction.followUp({
                                    ephemeral: true,
                                    content: "Manga déjà présent je vous ai ajouté à la liste des personnes à prévenir"
                                });
                                BDD.addLien(manga![0].id_manga, interaction.user.id);
                            }
                        });
                    }
                    else{
                        BDD.addUser(interaction.user.id, interaction.user.username).then(() => {
                            BDD.addLien(manga![0].id_manga, interaction.user.id).then(() => {
                                interaction.followUp({
                                    ephemeral: true,
                                    content: "Manga déjà présent je vous ai ajouté à la liste des personnes à prévenir"
                                });
                            });
                        });
                    }
                });
            }
            else{
                let page = interaction.options.get("page")?.value 
                BDD.addManga(nom as string, interaction.options.get("chapitre")?.value as number, (page === "oui" || page === "yes" || page === "o" || page === "y") ? true :false as boolean).then(() => {
                    BDD.getManga(nom as string).then((manga) => {
                        BDD.getUser(interaction.user.id).then((user) => {
                            if(user?.length === 0){
                                BDD.addUser(interaction.user.id, interaction.user.username).then(() => {
                                    interaction.followUp({
                                        ephemeral: true,
                                        content: "Manga ajouté avec succès"
                                    });
                                    return;
                                });
                            }
                            BDD.addLien(manga![0].id_manga, interaction.user.id).then(() => {
                                interaction.followUp({
                                    ephemeral: true,
                                    content: "Manga ajouté avec succès"
                                });
                            });
                        });
                    });
                });
            }
        });
    }
};