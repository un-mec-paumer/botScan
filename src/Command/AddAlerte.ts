import { Command } from "src/Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import mangas from "../data/mangas.json";
import { writeFile } from "fs";

export const AddAlerte: Command = {
    name: "addalerte",
    description: "Add an alerte when a new chapter is out for a manga",
    // type: "CHAT_INPUT",
    options: [
        {
            name: "name",
            description: "Name of the manga",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        },
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        let name = interaction.options.get("name")?.value;
        name = name?.toString().toLowerCase().replaceAll(" ", "-");
        let manga = mangas.find(manga => manga.name === name);
        if(manga === undefined){
            interaction.followUp({
                ephemeral: true,
                content: "Le manga n'existe pas"
            });
            return;
        }
        else{
            if(manga.discordUsers.find(user => user === interaction.user.id) === undefined){
                manga.discordUsers.push(interaction.user.id);
                console.log(mangas);
                interaction.followUp({
                    ephemeral: true,
                    content: "Vous êtes maintenant abonné à ce manga"
                });
            }
            else{
                interaction.followUp({
                    ephemeral: true,
                    content: "Vous êtes déjà abonné à ce manga"
                });
            }
        }
    }
};