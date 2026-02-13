import { ActionRowBuilder, Client, CommandInteraction, ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'node:fs';
import { BDD } from "./supabase";
import * as cheerio from 'cheerio';
import puppeteer, { Browser } from 'puppeteer-core';
import { jsPDF } from "jspdf";
import Manga from "./model/manga";
import { animeSamaUrl, BROWSER_PATH, DEV } from "./variables";


export async function initBrowser() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            // '--disable-setuid-sandbox',
            // '--disable-blink-features=AutomationControlled',
            // '--disable-extensions',
            // '--enable-gpu'
        ],
        executablePath: BROWSER_PATH,
        // executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        // ignoreHTTPSErrors: true,
        protocolTimeout: 60000,
    });

    return browser;
}

async function finder(manga: Manga, client: Client, browser: Browser): Promise<boolean> {
    // if (manga.id_manga !== 52) return false;
    try {
        const { tabChap: newChap, linkManga } = await manga.visiteAllSite(browser);
        if (newChap.length === 0) return false;

        await BDD.updateChapitre(manga.id_manga, newChap[newChap.length - 1]);
        const userBDD = await BDD.getLien(manga.id_manga);

        const img = (await BDD.getImgFromTest(manga.name_manga)).publicUrl ?? null;

        const message = new EmbedBuilder()
            .setTitle(manga.name_manga.replaceAll("-", " "))
            .setURL(linkManga)
            .setImage(img)
            .setFooter({
                text: "dev " + (await client.users.fetch(DEV)).username,
                iconURL: (await client.users.fetch(DEV)).displayAvatarURL()
            })

        for (let user of userBDD!) {
            sendNotifToUser(client, message, user.id_user, manga, newChap, linkManga);
        }

        return true;

    } catch (error) {
        console.log("Veux pas");
        console.error(manga.name_manga);
        console.error('Error:', error);
        return false;
    }
}

async function sendNotifToUser (client: Client, message: EmbedBuilder, id_user: any, manga: Manga, newChap: number[], linkManga: string): Promise<void> {
    // if (id_user !== DEV) return;
    const userDiscord = await client.users.fetch(id_user);

    const lastMessage = await userDiscord.dmChannel?.messages.fetch({ limit: 1 })
    // if (lastMessage?.last()?.content.includes(chap.replaceAll("-", " "))) return false;

    if (userDiscord === null) return;
    if (userDiscord.dmChannel === null) await userDiscord.createDM();
    let messageText = '';
    if (newChap.length === 1) messageText = `Le chapitre ${newChap[0]} de ${manga.name_manga.replaceAll("-", " ")} est sorti !\n${linkManga}`;
    else if (newChap.length === 2) messageText = `Les chapitres ${newChap[0]} et ${newChap[1]} de ${manga.name_manga.replaceAll("-", " ")} sont sortis !\n${linkManga}`;
    else messageText = `Les chapitres ${newChap[0]} à ${newChap[newChap.length - 1]} de ${manga.name_manga.replaceAll("-", " ")} sont sortis !\n${linkManga}`;

    message.setDescription(messageText);
    // console.log(messageText);
    const res = await userDiscord.send({ embeds: [message] });
    await res.react('👍');
}


export async function finderAll(client: Client): Promise<boolean> {
    console.log("finderAll");
    const time = new Date();
    console.log("temps: ", (time.getHours().toString().split("").length === 1 ? "0" : "") + time.getHours() + "h" + (time.getMinutes().toString().split("").length === 1 ? "0" : "") + time.getMinutes() + "min");
    //const userID = "452370867758956554";
    let browser = await initBrowser();
    const mangas = await BDD.getMangas() ?? [];

    const resultRes = await Promise.all(mangas.map(async (manga) => {
        const res = await finder(manga, client, browser);
        return res;
    }));
    


    // await page.close();
    // await browser.disconnect();
    await browser.close();
    return resultRes.reduce((acc, curr) => acc || curr, false);
}
//* inutilisé
export function sauvegarder(data: string/*, path:PathOrFileDescriptor*/): boolean {
    //console.log("data ", data);
    //let str = JSON.stringify(data);
    const path2: PathOrFileDescriptor = "./src/data/mangas.json";
    writeFileSync(path2, data, "utf-8");
    return true;
}

export async function downloadImg(imgStr: string, name_manga: string): Promise<void> {

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

export async function getCherrioText(url: string): Promise<cheerio.CheerioAPI> {
    try {
        const response = await fetch("http://webSearch:8080/search?url=" + encodeURIComponent(url), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(`Fetched data from websearch for URL: ${url}, Status: ${response.status}`);

        if (!response.ok) {
            // On lit le texte de l'erreur renvoyé par le serveur
            const errorText = await response.text(); 
            throw new Error(`Le serveur a renvoyé une erreur ${response.status} : ${errorText}`);
        }

        const data = await response.json() as {result: string};
        return cheerio.load(data.result);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Gérer l'erreur ici (par exemple, afficher un message à l'utilisateur)
        return cheerio.load('');
    }
}

// (async() => {
//     const url = `${animeSamaUrl}/catalogue/marchen-crown/`;
//     const $ = await getCherrioText(url);
//     console.log($.html());
// })()

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
        // console.log(id, DEV);
        if (id !== DEV) continue;
        const user = await client.users.fetch(id);
        // console.log(user.globalName);
        if (user.dmChannel === null) await user.createDM();
        // console.log((await (user.dmChannel?.messages.fetch()))?.map((message) => message.content));
        const messages = (await user.dmChannel?.messages.fetch())?.filter((message) => message.content.includes("est dans") && message.author.id === client.user?.id).map((message) => message.content) ?? [""];
        // console.log(messages);

        const nbJoursMsg = messages[0]?.split(" ").map((element) => parseInt(element)).filter((element) => !isNaN(element))[0] ?? 0
        // console.log(nbJoursMsg, nbjours);
        // console.log(nbJoursMsg > nbjours && now.getHours() === 13)
        if (nbJoursMsg > nbjours && now.getHours() === 12) {
            try {
                await user.send(`Salut ${user} le grand ***BARBECUE***/***FEU DE JOIE DE FIN D'ANNEE*** est dans ${nbjours} jour${nbjours !== 1 ? "s" : ""} (merci a justin pour le message avec les réactions de tous le monde) :) !`);
            }
            catch (error) {
                console.error(error);
            }
        }
    }
}
// endErasmus();

export async function getEmbedListeMangas(mangas: Manga[], interaction: CommandInteraction): Promise<void> {
    const dev = await interaction.client.users.fetch(DEV);
    mangas = mangas.sort((a, b) => a.name_manga.localeCompare(b.name_manga));
    const img = (await BDD.getImgFromTest(mangas[0].name_manga)).publicUrl ?? null;

    const embed = new EmbedBuilder()
        .setTitle(mangas[0].name_manga.replaceAll("-", " "))
        .setURL(mangas[0].getLink())
        .setDescription(`
        ***chapitre n°${mangas[0].chapitre_manga}***
        description:
        ${mangas[0].synopsis.split(" ").slice(0, 30).join(" ") + " ..."}   
    `)
        .setImage(img)
        .setTimestamp()
        .setFooter({
            text: "dev " + dev.username,
            iconURL: dev.displayAvatarURL()
        })

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("Select a manga")
        .addOptions(
            mangas.map((manga) => {
                return new StringSelectMenuOptionBuilder()
                    .setLabel(manga.name_manga.replaceAll("-", " "))
                    .setValue(String(manga.id_manga))
                    .setDescription(manga.synopsis.split(" ").slice(0, 10).join(" ") + " ...")
            })
        )

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)
    // .addComponents(leftButton, rightButton)

    const rep = await interaction.followUp({ embeds: [embed], components: [row] });

    // const filter = (i: any) => i.user.id === interaction.user.id;
    const collector = rep.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3600000 });


    collector.on("collect", async (i) => {

        const value = i.values[0];

        const manga = mangas.find((manga) => manga.id_manga === parseInt(value));
        if (!manga) return;
        const img = (await BDD.getImgFromTest(manga.name_manga))?.publicUrl ?? null;
        // console.log(img)
        const newEmbed = new EmbedBuilder()
            .setTitle(manga.name_manga.replaceAll("-", " "))
            .setDescription(`
            ***chapitre n°${manga.chapitre_manga}***
            description:
            ${manga.synopsis.split(" ").slice(0, 30).join(" ") + " ..."}    
        `)
            .setURL(manga.getLink())
            .setTimestamp()
            .setImage(img)

        await i.update({ embeds: [newEmbed] });
    });
}

function upperCaseFirstLetter(str: string): string {
    const tab = str.split("-");
    for (let i = 0; i < tab.length; i++) {
        const firstLetter = tab[i].charAt(0).toUpperCase();
        const restOfString = tab[i].slice(1).toLowerCase();
        tab[i] = firstLetter + restOfString;
    }
    return tab.join("%20");
}



export async function getImgToPdf(mangas: any, chap: number): Promise<void> {

    const RELOUDEMERDE: Record<string, string> = {
        "hunter-x-hunter": "Hunter%20x%20Hunter",
        "kaiju-n8": "Kaiju%20N°8",
        "shangri-la-frontier": "Shangri-La%20Frontier",
        "the-beginning-after-the-end": "The%20Beginning%20After%20the%20End",
        "the-max-level-player-100th-regression": "The%20Max-Level%20Player's%20100th%20Regression",
        "unordinary": "unOrdinary",
        "valkyrie-apocalypse": "Valkyrie%20apocalypse",
    }

    const name = RELOUDEMERDE[mangas.name_manga] ?? upperCaseFirstLetter(mangas.name_manga);
    const url = `${animeSamaUrl}/s2/scans/${name}/${chap}/`;

    const res = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [14400, 21600],
        putOnlyUsedFonts: true,
        floatPrecision: 16,
        compress: true,
    });
    res.deletePage(1); // supprime la première page vide

    for (let i = 1; i < 100; i++) {
        // console.log(i);
        const urlImg = `${url}${i}.jpg`;
        console.log(urlImg);
        const response = await fetch(urlImg, {
            method: 'GET',
            headers: {
                'Content-Type': 'image/png',
            },
        });
        
        if (response.status === 404 && i !== 1) break;
        const img = await response.arrayBuffer().then((buffer: ArrayBuffer) => {console.log(buffer) ; return new Uint8Array(buffer)});
        
        const size = getImageSize(img);
        console.log(size);
        if (size === null) {
            console.log("pb avec l'image: ", urlImg);
            break;
        }
        
        if (size.type !== "AVI") {
            if (size.width > 14400 || size.height > 14400) {
                size.width = size.width / 8;
                size.height = size.height / 8;
            }
    
            if (size.width > size.height) {
                res.addPage([size.height, size.width], "landscape");
                res.addImage(img, size.type, 0, 0, size.width, size.height, undefined, 'FAST'); 
            }
            else {
                res.addPage([size.height, size.width], "portrait");
                res.addImage(img, size.type, 0, 0, size.width, size.height, undefined, 'FAST');
            }
        }
    }
    res.save(`./test/${mangas.name_manga}-${chap}.pdf`);
}

function getImageSize(buffer: Uint8Array): { width: number, height: number, type: string } | null {
    // Vérifier PNG d'abord (signature PNG)
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        const width = (buffer[16] << 24) + (buffer[17] << 16) + (buffer[18] << 8) + buffer[19];
        const height = (buffer[20] << 24) + (buffer[21] << 16) + (buffer[22] << 8) + buffer[23];
        return { width, height, type: "PNG" };
    }

    // Vérifier JPEG (signature JPEG)
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
        let offset = 2;
        while (offset < buffer.length) {
            if (buffer[offset] !== 0xFF) return null;
            const marker = buffer[offset + 1];
            const length = (buffer[offset + 2] << 8) + buffer[offset + 3];

            if ([0xC0, 0xC2].includes(marker)) {
                const height = (buffer[offset + 5] << 8) + buffer[offset + 6];
                const width = (buffer[offset + 7] << 8) + buffer[offset + 8];
                return { width, height, type: "JPEG" };
            }

            offset += 2 + length;
        }
    }

    // Vérifier AVI (signature RIFF....AVI )
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
        if (buffer[8] === 0x41 && buffer[9] === 0x56 && buffer[10] === 0x49 && buffer[11] === 0x20) {
            // Normalement, l'info width/height est dans le 'strf' chunk, c'est plus compliqué.
            // Mais on peut déjà dire que c'est un AVI.
            return { width: 0, height: 0, type: "AVI" };
        } else {
            // Ce n'est pas un AVI valide.
            return null;
        }
    }

    return null;
}



// (async () => {
//     // const manga = await BDD.getMangas() ?? [];
//     // for (let i = 0; i < manga.length; i++) {
//     //     try { await getImgToPdf(manga[i], manga[i].chapitre_manga!);}
            
//     //     catch (error) {
//     //         console.error(error);
//     //         console.error(manga[i].name_manga);
//     //     }
//     // }   

//     await getImgToPdf({name_manga: "magic-emperor", chapitre_manga: 587}, 587);
// })()

