import { Command } from "../Command";
import { Client, ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
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
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const name = interaction.options.getString("name", true)
                    ?.toString().toLowerCase().replaceAll(" ", "-");

        const manga = await BDD.getManga(name!);

        if(manga!.length === 0){
            interaction.followUp({
                ephemeral: true,
                content: "Manga non trouvé"
            });
            return;
        }

        const error = await BDD.supprimerLien(manga![0].id, interaction.user.id);

        if(error){
            interaction.followUp({
                ephemeral: true,
                content: `Vous n'êtes pas dans la liste des personnes à prévenir de ${manga![0].name.replaceAll("-", " ")}`
            });
            return;
        }

        interaction.followUp({
            ephemeral: true,
            content: `Vous avez été supprimé de la liste des personnes à prévenir de ${manga![0].name.replaceAll("-", " ")}`
        });
    }
};
