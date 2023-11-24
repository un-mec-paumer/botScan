import { Command } from "../Command";
import { CommandInteraction, Client, ApplicationCommandOptionType, Message } from "discord.js";
import { BDD } from "../supabase";
import { type } from "os";
// import { MessageEmbed } from "discord.js";
// import { APIEmbed, JSONEncodable } from "discord-api-types"

type Manga = {
    id_manga?: number;
    name_manga?: string;
    chapitre_manga?: number;
    img?: string;
    synopsis?: string;
};


export const ListeManga: Command = {
    name: "maliste",
    description: "Liste des mangas suivis",
    // type: "CHAT_INPUT",
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        // console.log("Hello world!");
        let messageListe:any = []
        let nom = "";
        //console.log(interaction.user.id);

        await BDD.getMangaBylien(interaction.user.id).then((mangas) => {
            // console.log("mangas", mangas);

            mangas?.forEach((manga: Manga) => {
                // console.log("manga", manga);
                nom = manga.name_manga?.replaceAll("-", " ") ?? "";
                const synopsis = manga.synopsis ?? ""; // Add this line to handle the possibility of 'manga.synopsis' being undefined
                const messageContent = {
                    //content: "test",
                    embeds: [
                        {
                            title: nom,
                            description: `chapitre: ${manga.chapitre_manga} \n synopsis: ${synopsis.substring(0, 100)}...`, // Use 'synopsis' instead of 'manga.synopsis'
                            image: { url: manga.img || "" }
                        }
                    ]
                };
                messageListe.push(messageContent);
            });

            
        })
        .then(() => {

            //console.log("messageListe", messageListe);
            messageListe.forEach((message: any) => {
                console.log("message", message);
                interaction.channel?.send(message);
            });
        // console.log(messageListe);
        })
    }
};