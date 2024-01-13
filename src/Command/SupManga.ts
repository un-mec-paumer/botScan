import { Command } from "../Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { BDD } from "../supabase";
import dotenv from "dotenv";

export const SupManga: Command = {
    name: "supmanga",
    description: "Delete a manga from the list",
    descriptionLocalizations: {
        fr: "Supprime un manga de la liste"
    },
    // type: "CHAT_INPUT",
    options: [
        {
            name: "name",
            description: "Nom du manga",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
            descriptionLocalizations: {
                fr: "Nom du manga"
            },
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        // console.log("Hello world!");

        //console.log(interaction.options);
        const nom = interaction.options.get("name")?.value
                    ?.toString().replaceAll(" ", "-").toLowerCase();
        dotenv.config();


        if(interaction.user.id !== process.env.DEV!) {
            interaction.followUp({
                ephemeral: true,
                content: "Vous n'avez pas les droits pour cette commande"
            });
            return;
        }

        const manga = await BDD.getManga(nom as string);
        // console.log(manga);
        if(manga!.length === 0){
            interaction.followUp({
                ephemeral: true,
                content: "Le manga n'existe pas"
            });
            return;
        }

        await BDD.supprimerManga(manga![0].name_manga);
        await BDD.supImgFromTest(manga![0].name_manga);

        interaction.followUp({
            ephemeral: true,
            content: "Manga supprimé"
        });
    }
};
