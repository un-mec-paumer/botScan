import { Command } from "../Command";
import { Client, ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { downloadImg, getCherrioText } from "../function";
import { animeSamaUrl } from "../variables";
import { addManga, getMangaByName } from "../service/mangasApi";
import { addUser, getUser } from "../service/usersApi";
import { addMangaAlert, getAlertsByMangaId } from "../service/alertsApi";

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
    ],
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        // console.log("Hello world!");

        const nom = interaction.options.getString("name", true)
                    ?.toString().toLowerCase().replaceAll(" ", "-");
        //console.log(mangas.find(manga => manga.name === nom));

        const manga = await getMangaByName(nom);
        const user = await getUser(interaction.user.id);
        if(manga) {
            //* nom de variable mofifié car bancale (précédemment user) et en conflit avec la déclaration du dessus qui empêche d'en faire une constante
            const userLien = await getAlertsByMangaId(manga.id);

            if(userLien!.find(id_user => id_user.id_user == interaction.user.id) !== undefined){
                interaction.followUp({
                    ephemeral: true,
                    content: "Vous êtes déjà dans la liste des personnes à prévenir"
                });
                return;
            }

            if(!user) {
                await addUser(interaction.user.id, interaction.user.username, interaction.user.avatarURL()!);
            }

            await addMangaAlert(manga!.id, interaction.user.id);
            interaction.followUp({
                ephemeral: true,
                content: "Manga déjà présent, vous avez été ajouté à la liste des personnes à prévenir"
            });
            return;
        }

        //console.log("verif ");
        // const page = interaction.options.get("page")?.value;
        const url = `${animeSamaUrl}/catalogue/${nom}/`;

        const $ = await getCherrioText(url);


        if($("#coverOeuvre").attr("src") === undefined) {
            interaction.followUp({
                ephemeral: true,
                content: `Manga non trouvable sur le site ${animeSamaUrl}`
            });
            return;
        }

        const image = $("#coverOeuvre").attr("src")
        // console.log(image);
        const synopsis = $(".text-sm.text-gray-400.mt-2").text().trim();
        //console.log(synopsis);
        
        //* Déclaration idéale pour le 3ème argument :
        
        await addManga(
            nom,
            interaction.options.get("chapitre")?.value as number,
            false,
            image!,
            synopsis
        );
        downloadImg(image as string, nom);

        if(!user) {
            const useravatar = interaction.user.avatarURL();
            await addUser(interaction.user.id, interaction.user.username, useravatar!);
            interaction.followUp({
                ephemeral: true,
                content: "Manga ajouté avec succès"
            });
            return;
        }
        const newManga = await getMangaByName(nom);

        await addMangaAlert(newManga!.id, interaction.user.id);
        interaction.followUp({
            ephemeral: true,
            content: "Manga ajouté avec succès"
        });
    }
};
