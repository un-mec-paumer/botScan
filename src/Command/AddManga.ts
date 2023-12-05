import { Command } from "../Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { BDD } from "../supabase";
import * as cheerio from 'cheerio';
// import mangas from "../data/mangas.json";
import { downloadImg } from "../function";
type json = { args: {url:string}, headers: { [key: string]: string }, origin: string, url: string };


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

        BDD.getManga(nom as string).then( async (manga) => {
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
                        BDD.addUser(interaction.user.id, interaction.user.username, interaction.user.avatarURL()!).then(() => {
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
                //console.log("verif ");
                let page = interaction.options.get("page")?.value 
                const url = "https://fr-scan.com/manga/" + nom + "/"
                const proxyUrl = 'https://httpbin.org/get?url=' + encodeURIComponent(url);


                const response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'text/html',
                        'User-Agent': 'PostmanRuntime/7.32.1',
                    },
                });
        
                const json = await response.json() as json;
                const text = await fetch(json.args.url, json.headers).then(async (response) => {
                    const text = await response.text();
                    return text;
                })

                //const text = await verif.text();
                const $ = cheerio.load(text);

                //console.log($(".summary_image img").attr("src"));
                if($(".summary_image img").attr("data-src") === undefined){
                    interaction.followUp({
                        ephemeral: true,
                        content: "Manga non trouvable sur le site fr-scan.com"
                    });
                    return;
                }
                const image = $(".summary_image img").attr("data-src")
                // console.log(image);
                const synopsis = $(".summary__content").text().trim();
                //console.log(synopsis)
                
                BDD.addManga(nom as string, interaction.options.get("chapitre")?.value as number, (page === "oui" || page === "yes" || page === "o" || page === "y") ? true :false as boolean, image!, synopsis).then(() => {
                    downloadImg(image!, nom as string)
                    BDD.getManga(nom as string).then((manga) => {
                        BDD.getUser(interaction.user.id).then((user) => {
                            if(user?.length === 0){
                                const useravatar = interaction.user.avatarURL();
                                BDD.addUser(interaction.user.id, interaction.user.username, useravatar!).then(() => {
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