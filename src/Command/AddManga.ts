import { Command } from "src/Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import mangas from "../data/mangas.json";
import { sauvegarder } from "src/function";

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

        if(mangas.find(manga => manga.name === nom) === undefined){
            //console.log(nom);
            let page = interaction.options.get("page")?.value;
            page = page?.toString().toLowerCase();
            mangas.push({
                name: nom as string,
                chapitre: interaction.options.get("chapitre")?.value as number,
                pages: page === "oui" || page === "yes" || page === "o" || page === "y" ? true : false as boolean,
                discordUsers: [interaction.user.id]
            });
            console.log(mangas);
            sauvegarder(JSON.stringify(mangas));
            interaction.followUp({
                ephemeral: true,
                content: "Manga ajouté avec succès"
            });

            // writeFile("./src/data/mangas.json", JSON.stringify(mangas), (err) => {
            //     if (err) {
            //         console.log(err);
            //         interaction.followUp({
            //             ephemeral: true,
            //             content: "Erreur lors de l'ajout du manga"
            //         });
            //     }
            //     else {
            //         interaction.followUp({
            //             ephemeral: true,
            //             content: "Manga ajouté avec succès"
            //         });
            //     }
            // });
        }
        else{
            if(mangas.find(manga => manga.name === nom)?.discordUsers.includes(interaction.user.id)){
                interaction.followUp({
                    ephemeral: true,
                    content: "tu est déjà dans la liste des personnes à prévenir"
                });
            }
            else{
                mangas.find(manga => manga.name === nom)?.discordUsers.push(interaction.user.id);
                interaction.followUp({
                    ephemeral: true,
                    content: "Manga déjà présent je vous ai ajouté à la liste des personnes à prévenir"
                }); 
            }
        }
    }
};