import { Command } from "../Command";
import { ChatInputCommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
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
        }
    ],
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const nameRaw = interaction.options.getString("name", true);
        const name = nameRaw.toLowerCase().replaceAll(" ", "-");

        const manga = await BDD.getManga(name!)
        // console.log(manga);
        if (manga!.length == 0) {
            interaction.followUp({
                ephemeral: true,
                content: "Manga non trouvé"
            });
            return;
        }

        //* nom de variable car bancale (précédemment user) et en conflit avec la déclaration du dessus qui empêche d'en faire une constante
        const userTest = await BDD.getLien(manga![0].id);
        // console.log(user, interaction.user.id);
        if(userTest!.find(id_user => id_user.id_user == interaction.user.id) !== undefined){
            interaction.followUp({
                ephemeral: true,
                content: "Vous êtes déjà dans la liste des personnes à prévenir"
            });
            return;
        }

        const userBDD = await BDD.getUser(interaction.user.id);
        if(userBDD?.length === 0) {
            const useravatar = interaction.user.avatarURL();
            await BDD.addUser(interaction.user.id, interaction.user.username, useravatar!);
        }

        await BDD.addLien(manga![0].id, interaction.user.id)
        interaction.followUp({
            ephemeral: true,
            content: `Vous avez été ajouté à la liste des personnes à prévenir de ${manga![0].name.replaceAll("-", " ")}`
        });
    }
};
