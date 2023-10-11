import { Command } from "src/Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import mangas from "../data/mangas.json";
import { sauvegarder } from "../function";

export const SupAlerte: Command = {
    name: "supalerte",
    description: "sup an alerte when a new chapter is out for a manga",
    // type: "CHAT_INPUT",
    options: [
        {
            name: "name",
            description: "Name of the manga",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
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
                interaction.followUp({
                    ephemeral: true,
                    content: "Vous n'êtes pas abonné à ce manga"
                });
            }
            else{
                manga.discordUsers = manga.discordUsers.filter(user => user !== interaction.user.id);
                // console.log(mangas);
                sauvegarder(JSON.stringify(mangas));
                interaction.followUp({
                    ephemeral: true,
                    content: "Vous n'êtes plus abonné à ce manga"
                });
            }
        }
    }
};