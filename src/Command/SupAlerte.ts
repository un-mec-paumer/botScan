import { Command } from "../Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import { BDD } from "../supabase";

export const SupAlerte: Command = {
    name: "supalerte",
    description: "sup an alerte when a new chapter is out for a manga",
    descriptionLocalizations: {
        fr: "Supprime une alerte quand un nouveau chapitre d'un manga est sorti"
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
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        const name = interaction.options.get("name")?.value
                    ?.toString().toLowerCase().replaceAll(" ", "-");

        const manga = await BDD.getManga(name!);

        if(manga!.length === 0){
            interaction.followUp({
                ephemeral: true,
                content: "Manga non trouvé"
            });
            return;
        }

        const error = await BDD.supprimerLien(manga![0].id_manga, interaction.user.id);

        if(error){
            interaction.followUp({
                ephemeral: true,
                content: `Vous n'êtes pas dans la liste des personnes à prévenir de ${manga![0].name_manga.replaceAll("-", " ")}`
            });
            return;
        }

        interaction.followUp({
            ephemeral: true,
            content: `Vous avez été supprimé de la liste des personnes à prévenir de ${manga![0].name_manga.replaceAll("-", " ")}`
        });
    }
};
