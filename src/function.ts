import { ApplicationCommandPermissionsManager, Client, CommandInteraction, EmbedBuilder, Message, TextChannel } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
import { BDD } from "./supabase";
import * as cheerio from 'cheerio';
import puppeteer, { Page } from 'puppeteer-core';
import * as dotenv from 'dotenv';

dotenv.config()

type Manga = {
    id_manga?: number,
    name_manga?: string,
    chapitre_manga?: number,
    page?: boolean,
    img?: string,
    synopsis?: string
};

export async function initBrowser() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
        ],
        executablePath: process.env.CHROME_PATH
    });

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const resourceType = req.resourceType();
        const expectedResourceTypes = ["image", "stylesheet", "font", "media"];
        if (expectedResourceTypes.includes(resourceType)) {
            req.abort();
        } else {
            req.continue();
        }
    });
    return {browser, page}
}

async function finder(manga: Manga, client:Client, page:Page) /*Promise<boolean>*/ {

    const RELOUDEMERDE = ["one-piece"]
    const urlBase = "https://anime-sama.fr/catalogue/";
    const chap = String(manga.chapitre_manga).replace(".", "-");
    const url: string = `${urlBase + manga.name_manga}/scan${RELOUDEMERDE.includes(manga.name_manga!) ? "_noir-et-blanc":""}/vf/`;
    // const url: string = `${urlBase + manga.name_manga}/chapitre-1099-vf/1000000/`;
    // console.log(url);


    // console.log(manga.name_manga);

    try {
        const $ = await getCherrioText(url, page);
        // console.log($.html());
        const newChap = $("#selectChapitres option").toArray().map((element) => { return $(element).attr("value") }).filter((element) => { 
            const nbChap = parseFloat(element!.split(" ")[1])
            return nbChap > manga.chapitre_manga!
        }).map((element) => { return parseFloat(element!.split(" ")[1])});

        // console.log(newChap);

        if(newChap.length === 0) {
            // console.log(`nextUrl : ${nextUrl}`);
            return false;
        }
               
        await BDD.updateChapitre(manga.name_manga!, newChap[newChap.length - 1]);
        const userBDD = await BDD.getLien(manga.id_manga!);

        userBDD!.forEach(async (user) => {
            const userDiscord = await client.users.fetch(user.id_user);
            if(userDiscord === null) return;
            if(userDiscord.dmChannel === null) await userDiscord.createDM();
            if (newChap.length === 1) await userDiscord.send(`Le chapitre ${newChap[0]} de ${manga.name_manga!.replaceAll("-", " ")} est sorti !\n${url}`);
            else if (newChap.length === 2) await userDiscord.send(`Les chapitres ${newChap[0]} et ${newChap[1]} de ${manga.name_manga!.replaceAll("-", " ")} sont sortis !\n${url}`);
            else await userDiscord.send(`Les chapitres ${newChap[0]} à ${newChap[newChap.length - 1]} de ${manga.name_manga!.replaceAll("-", " ")} sont sortis !\n${url}`);
        });

        return true;
        
    } catch (error) {
        console.log("Veux pas");
        console.error(manga.name_manga!);
        console.error('Error:', error);
        return false;
    }
}


export async function finderAll(client: Client) {
    console.log("finderAll");
    //const userID = "452370867758956554";
    const {browser, page} = await initBrowser();
    const mangas = await BDD.getMangas() ?? [];
    
    for (const manga of mangas) {
        try {
            const res = await finder(manga, client, page);
            // if(!res) console.log(`Pas de nouveau chapitre pour ${manga.name_manga}`);
        } catch (error) {
            console.error(error);
        }
    }

    await page.close();
    await browser.close();
}
//* inutilisé
export function sauvegarder(data:string/*, path:PathOrFileDescriptor*/): boolean {
    //console.log("data ", data);
    //let str = JSON.stringify(data);
    const path2: PathOrFileDescriptor = "./src/data/mangas.json";
    writeFileSync(path2, data, "utf-8");
    return true;
}

export async function downloadImg(imgStr:string, name_manga:string): Promise<void> {
    
    const response = await fetch(imgStr, {
        method: 'GET',
        headers: {
            'Content-Type': 'image/png',
        },
    });
    // console.log(response);

    const img = await response.arrayBuffer().then((buffer: ArrayBuffer) => buffer);
    // console.log(img);
    await BDD.addImgToTest(name_manga + ".png", img);
}

export function tabin(message:string, tab:Array<string>): boolean {
    return tab.filter((element) => {return element === message}).length === 1;
}

export async function getCherrioText(url: string, page:Page) {
    try {
        await page.goto(url, {
            waitUntil: 'load',
            timeout: 450000
        });
        // await page.waitForSelector('#selectChapitres');
        const html = await page.content();

        return cheerio.load(html);
    } catch (error) {
        console.error(error);
        return cheerio.load("");
    }
}

export async function endErasmus(client: Client): Promise<void> {
    const now = new Date();
    const end = new Date("2024-06-23");
    const nbjours = end.getDate() - now.getDate();
    console.log(endErasmus.name);


    const channel = client.channels.cache.get("1047523523712786462") as TextChannel;
    const message = await channel.messages.fetch("1252705831275986984")
    const usersReactionPending = message.reactions.cache.map(async (reaction) => await reaction.users.fetch())[0];

    const usersReaction = (await usersReactionPending).map((user) => user.id);
    // console.log(usersReaction);

    for (let id of usersReaction) {
        // console.log(id, process.env.DEV);
        if (id !== process.env.DEV) continue;
        const user = await client.users.fetch(id);
        // console.log(user.globalName);
        if (user.dmChannel === null) await user.createDM();
        // console.log((await (user.dmChannel?.messages.fetch()))?.map((message) => message.content));
        const messages = (await user.dmChannel?.messages.fetch())?.filter((message) => message.content.includes("est dans") && message.author.id === client.user?.id).map((message) => message.content) ?? [""];
        // console.log(messages);

        const nbJoursMsg = messages[0]?.split(" ").map((element) => parseInt(element)).filter((element) => !isNaN(element))[0] ?? 0
        // console.log(nbJoursMsg, nbjours);
        // console.log(nbJoursMsg > nbjours && now.getHours() === 13)
        if(nbJoursMsg > nbjours && now.getHours() === 12) {
            try
            {
                await user.send(`Salut ${user} le grand ***BARBECUE***/***FEU DE JOIE DE FIN D'ANNEE*** est dans ${nbjours} jour${nbjours !== 1 ? "s":""} (merci a justin pour le message avec les réactions de tous le monde) :) !`);
            }
            catch (error) {
                console.error(error);
            }
        }
    }
}
// endErasmus();

export async function getEmbedListeMangas(mangas: any[], interaction: CommandInteraction): Promise<void> {
    // const RELOUDEMERDE = ["one-piece"]
    // const mangaList = await BDD.getMangaBylien(interaction.user.id);
    // const embeds: EmbedBuilder[] = [];
    const dev = await interaction.client.users.fetch(process.env.DEV!);
    const embed = new EmbedBuilder()
    .setTitle("Liste des mangas")
    .setDescription(`
        Voici la liste des mangas que tu peux trouver
        ${mangas[0]?.name_manga}
        ${mangas[0]?.synopsis.split(" ").slice(0, 30).join(" ") + " ..."}    
    `)
    .setImage(mangas[0]?.imageURL)
    .setTimestamp()
    .setFooter({
        text: "dev" + dev.username,
        iconURL: dev.displayAvatarURL()
        
    })
    // .setAuthor({
    //     name: "dev" + dev.username,
    //     iconURL: dev.displayAvatarURL()
    // })

    try{
        // interaction.followUp({embeds: [embed]});

        const message = (await interaction.followUp({embeds: [embed]})) as Message
        // console.log("message", message);
        await message.react("👈");
        await message.react("👉");

        interaction.client.on("messageReactionAdd", async (reaction) => {
            const newEmbed = new EmbedBuilder()
            .setTitle("Liste des mangas")
            .setTimestamp()
            .setAuthor({
                name: "dev" + dev.username,
                iconURL: dev.displayAvatarURL()
            })
            .setDescription(`
                Voici la liste des mangas que tu peux trouver
                ${mangas[0]?.name_manga}
                ${mangas[0]?.synopsis.split(" ").slice(0, 30).join(" ") + " ..."}    
            `)
            .setImage(mangas[0]?.img)


            const idManga = mangas.findIndex((manga) => {
                return manga.name_manga === message.embeds[0].description?.split(" ").map((element) => element.replace('\n', '')).filter((element) => element !== "")[9]
            });



            if(reaction.emoji.name === "👈") {
                
            }
            else if(reaction.emoji.name === "👉") {
                newEmbed.setDescription(`
                    Voici la liste des mangas que tu peux trouver
                    ${mangas[idManga + 1]?.name_manga}
                    ${mangas[idManga + 1]?.synopsis.split(" ").slice(0, 30).join(" ") + " ..."}    
                `)
                .setImage(mangas[idManga + 1]?.img)
            
                // console.log(idManga);
                await message.edit({embeds: [newEmbed]})
            }
        });

    }
    catch (error) {
        console.error(error);
        interaction.followUp({ content: "Une erreur est survenue, merci de reessayer ultérieurement", ephemeral: true });
    }

    
    // interaction.client.on("reactionAdd", async (reaction) => {
    //     if(reaction.emoji.name === ":point_left:") {
    //         console.log("reactionAdd");
    //     }
    // });
}

// downloadImg('https://fr-scan.com/wp-content/uploads/2022/09/shuumatsu_no_valkyrie_ibun_-_ryo_fu_hou_sen_hishouden_vol_3945333-193x278.jpg', "test")

// finderAll();
// downloadImg()


// async function getvideo(url: string) {
//     const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'video/mp4',
//         },
//     });

//     console.log(response);

//     const video = await response.arrayBuffer().then((buffer: ArrayBuffer) => buffer).then((buffer: ArrayBuffer) => new Uint8Array(buffer));
//     // console.log(video);



//     // const path: PathOrFileDescriptor = "./video.mp4";
//     // writeFileSync(path, video, "binary");
// }
