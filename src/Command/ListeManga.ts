import { Command } from "../Command";
import { CommandInteraction, Client, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
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
    description: "List of all mangas",
    descriptionLocalizations: {
        fr: "Liste des mangas suivis"
    },
    // type: "CHAT_INPUT",
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        // console.log("Hello world!");
        let nom = "";
        //console.log(interaction.user.id);

        const mangas = await BDD.getMangaBylien(interaction.user.id)
        
        // console.log("mangas", mangas);
        interaction.followUp({ content: "Voici la liste des mangas que tu suis" });
        mangas?.forEach(async(manga: Manga) => {
            // console.log("manga", manga);
            nom = manga.name_manga?.replaceAll("-", " ") ?? "";
            const synopsis = manga.synopsis ?? "";
            const img = BDD.getImgFromTest(manga.name_manga!);
            const imgUrl = await img.then((value) => { return value?.signedUrl ?? ""; });
            // console.log(manga.name_manga, imgUrl);
            const messageContent = new EmbedBuilder()
                .setTitle(nom)
                .setDescription(synopsis.split(" ").slice(0, 50).join(" ") + "...")
                .setImage(imgUrl);
            //messageListe.push(messageContent);
            interaction.followUp({ embeds: [messageContent] });
        })
    }
};