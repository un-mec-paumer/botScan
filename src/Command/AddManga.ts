import { Command } from "../Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { BDD } from "../supabase";
import { downloadImg, tabin, getCherrioText, initBrowser} from "../function";

export const AddManga: Command = {
    name: "addmanga",
    description: "Add a manga to the scrap bot",
    descriptionLocalizations: {
        fr: "Ajoute un manga au bot de scrap"
    },
    // type: "CHAT_INPUT",
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
        {
            name: "chapitre",
            description: "number of the last chapter",
            type: ApplicationCommandOptionType.Number,
            required: true,
            autocomplete: true,
            descriptionLocalizations: {
                fr: "numero du dernier chapitre"
            },
        },
        // {
        //     name: "page",
        //     description: "is the manga on multiple pages or not",
        //     type: ApplicationCommandOptionType.String,
        //     required: true,
        //     autocomplete: true,
        //     descriptionLocalizations: {
        //         fr: "le manga est t'il sur plusieurs pages ou non"
        //     },
            
        // }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        // console.log("Hello world!");

        const nom = interaction.options.get("name")?.value
                    ?.toString().toLowerCase().replaceAll(" ", "-");
        //console.log(mangas.find(manga => manga.name === nom));

        const manga = await BDD.getManga(nom as string);
        const user = await BDD.getUser(interaction.user.id);
        if(manga!.length === 1) {
            //* nom de variable mofifié car bancale (précédemment user) et en conflit avec la déclaration du dessus qui empêche d'en faire une constante
            const userLien = await BDD.getLien(manga![0].id_manga);

            if(userLien!.find(id_user => id_user.id_user == interaction.user.id) !== undefined){
                interaction.followUp({
                    ephemeral: true,
                    content: "Vous êtes déjà dans la liste des personnes à prévenir"
                });
                return;
            }

            if(user?.length !== 1) {
                await BDD.addUser(interaction.user.id, interaction.user.username, interaction.user.avatarURL()!);
            }

            await BDD.addLien(manga![0].id_manga, interaction.user.id);
            interaction.followUp({
                ephemeral: true,
                content: "Manga déjà présent, vous avez été ajouté à la liste des personnes à prévenir"
            });
            return;
        }

        //console.log("verif ");
        // const page = interaction.options.get("page")?.value;
        const url = `https://anime-sama.fr/catalogue/${nom}/`;

        const {browser, page: page2} = await initBrowser();
        const $ = await getCherrioText(url, page2);
        await page2.close();
        await browser.close();


        if($("#coverOeuvre").attr("src") === undefined) {
            interaction.followUp({
                ephemeral: true,
                content: "Manga non trouvable sur le site anime-sama.fr"
            });
            return;
        }

        const image = $("#coverOeuvre").attr("src")
        // console.log(image);
        const synopsis = $(".text-sm.text-gray-400.mt-2").text().trim();
        //console.log(synopsis);
        
        //* Déclaration idéale pour le 3ème argument :
        
        await BDD.addManga(
            nom as string,
            interaction.options.get("chapitre")?.value as number,
            false,
            image!,
            synopsis
        );
        downloadImg(image as string, nom as string);

        if(user?.length === 0) {
            const useravatar = interaction.user.avatarURL();
            await BDD.addUser(interaction.user.id, interaction.user.username, useravatar!);
            interaction.followUp({
                ephemeral: true,
                content: "Manga ajouté avec succès"
            });
            return;
        }
        const newManga = await BDD.getManga(nom as string);

        await BDD.addLien(newManga![0].id_manga, interaction.user.id);
        interaction.followUp({
            ephemeral: true,
            content: "Manga ajouté avec succès"
        });
    }
};
