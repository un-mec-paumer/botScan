import { Command } from "src/Command";
import { CommandInteraction, Client, ApplicationCommandOptionType } from "discord.js";
import mangas from "../data/mangas.json";
import { writeFile } from "fs";

export const SupManga: Command = {
    name: "supmanga",
    description: "Supprime un manga de la liste",
    // type: "CHAT_INPUT",
    options: [
        {
            name: "name",
            description: "Nom du manga",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        // console.log("Hello world!");

        //console.log(interaction.options);
        let nom = interaction.options.get("name")?.value;
        nom = nom?.toString().replace(" ", "-").toLowerCase();
        let manga = mangas.find(manga => manga.name === nom);
        if (manga) {
            mangas.splice(mangas.indexOf(manga), 1);
            writeFile("./src/data/mangas.json", JSON.stringify(mangas), (err) => {
                if (err) {
                    console.log(err);
                    interaction.followUp({
                        ephemeral: true,
                        content: "Erreur lors de la suppression du manga"
                    });
                }
                else {
                    interaction.followUp({
                        ephemeral: true,
                        content: "Manga supprimé avec succès"
                    });
                }
            });
        }
        else {
            interaction.followUp({
                ephemeral: true,
                content: "Manga non trouvé"
            });
        }
    }
};