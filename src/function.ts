import { ActionRowBuilder, Client, CommandInteraction, ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
import { BDD } from "./supabase";
import * as cheerio from 'cheerio';
import puppeteer, { Page } from 'puppeteer-core';
import * as dotenv from 'dotenv';
import { jsPDF, jsPDFAPI } from "jspdf";
import e from "express";


dotenv.config()

type Manga = {
    id_manga?: number,
    name_manga?: string,
    chapitre_manga?: number,
    page?: boolean,
    img?: string,
    synopsis?: string
};

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/115.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/114.0",
    "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; Samsung Galaxy S21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/118.0.2088.46",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Version/15.2 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Opera/91.0.4472.106",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
];

export async function initBrowser() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--disable-extensions',
            '--enable-gpu'
        ],
        executablePath: process.env.CHROME_PATH,
        // executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        // ignoreHTTPSErrors: true,
        protocolTimeout: 60000,
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

    await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
    await page.setViewport({ width: 1920, height: 1080 });
    // await page.setDefaultNavigationTimeout(0);
    return { browser, page }
}

async function finder(manga: Manga, client: Client, page: Page) /*Promise<boolean>*/ {

    const RELOUDEMERDE = ["one-piece"]
    const urlBase = "https://anime-sama.org/catalogue/";
    const chap = String(manga.chapitre_manga).replace(".", "-");
    const url: string = `${urlBase + manga.name_manga}/scan${RELOUDEMERDE.includes(manga.name_manga!) ? "_noir-et-blanc" : ""}/vf/`;
    // const url: string = `${urlBase + manga.name_manga}/chapitre-1099-vf/1000000/`;
    // console.log(url);


    // console.log(manga.name_manga);



    try {
        const $ = await getCherrioText(url, page);
        // console.log($.html());
        const newChap = $("#selectChapitres option").toArray().map((element) => { return $(element).attr("value") }).filter((element) => {
            const nbChap = parseFloat(element!.split(" ")[1])
            return nbChap > manga.chapitre_manga!
        }).map((element) => { return parseFloat(element!.split(" ")[1]) });

        // console.log(newChap);

        if (newChap.length === 0) {
            // console.log(`nextUrl : ${nextUrl}`);
            return false;
        }

        await BDD.updateChapitre(manga.name_manga!, newChap[newChap.length - 1]);
        const userBDD = await BDD.getLien(manga.id_manga!);

        const img = (await BDD.getImgFromTest(manga.name_manga!)).publicUrl ?? null;

        const message = new EmbedBuilder()
            .setTitle(manga.name_manga!.replaceAll("-", " "))
            .setURL(url)
            .setImage(img)
            .setFooter({
                text: "dev " + (await client.users.fetch(process.env.DEV!)).username,
                iconURL: (await client.users.fetch(process.env.DEV!)).displayAvatarURL()
            })

        userBDD!.forEach(async (user) => {
            const userDiscord = await client.users.fetch(user.id_user);

            const lastMessage = await userDiscord.dmChannel?.messages.fetch({ limit: 1 })
            if (lastMessage?.last()?.content.includes(chap.replaceAll("-", " "))) return false;

            if (userDiscord === null) return;
            if (userDiscord.dmChannel === null) await userDiscord.createDM();
            let messageText = '';
            if (newChap.length === 1) messageText = `Le chapitre ${newChap[0]} de ${manga.name_manga!.replaceAll("-", " ")} est sorti !\n${url}`;
            else if (newChap.length === 2) messageText = `Les chapitres ${newChap[0]} et ${newChap[1]} de ${manga.name_manga!.replaceAll("-", " ")} sont sortis !\n${url}`;
            else messageText = `Les chapitres ${newChap[0]} à ${newChap[newChap.length - 1]} de ${manga.name_manga!.replaceAll("-", " ")} sont sortis !\n${url}`;

            message.setDescription(messageText);
            console.log(messageText);
            await userDiscord.send({ embeds: [message] });
        });

        return true;

    } catch (error) {
        console.log("Veux pas");
        console.error(manga.name_manga!);
        console.error('Error:', error);
        return false;
    }
}


export async function finderAll(client: Client): Promise<boolean> {
    console.log("finderAll");
    const time = new Date();
    console.log("temps: ", (time.getHours().toString().split("").length === 1 ? "0" : "") + time.getHours() + "h" + (time.getMinutes().toString().split("").length === 1 ? "0" : "") + time.getMinutes() + "min");
    //const userID = "452370867758956554";
    let { browser, page } = await initBrowser();
    const mangas = await BDD.getMangas() ?? [];

    const resultRes = [];
    for (const manga of mangas) {
        let res = false;
        try {
            if (browser.connected === false || page.isClosed() === true) {
                console.log("reconnexion");
                const { browser: browser2, page: page2 } = await initBrowser();
                browser = browser2;
                page = page2;
            }
            res = await finder(manga, client, page);
            // if(!res) console.log(`Pas de nouveau chapitre pour ${manga.name_manga}`);
        } catch (error) {
            console.error("pb avec ça: ");
            console.error(error);

            const { browser: browser2, page: page2 } = await initBrowser();
            browser = browser2;
            page = page2;

            res = await finder(manga, client, page);
        }
        resultRes.push(res);
    }


    await page.close();
    // await browser.disconnect();
    await browser.close();
    return resultRes.includes(true);
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

export function tabin(message: string, tab: Array<string>): boolean {
    return tab.filter((element) => { return element === message }).length === 1;
}

export async function getCherrioText(url: string, page: Page) {
    try {
        // console.log("url: ", url);
        const test = await page.goto(url, {
            waitUntil: 'networkidle2',
            // timeout: 45000
        });

        // console.log(test?.ok(), ' sur le site: ', url);

        // console.log("console: ", test?.ok(), ' sur le site: ', url);
        // console.log(test?.status(), " ", test?.statusText());
        // console.log(test?.remoteAddress());

        if (!test?.ok()) {
            console.error("error coté serveur ou puppeteer");
            return cheerio.load("");
        }
        // await page.waitForSelector('#selectChapitres');
        const html = await page.content();
        // console.log(html);

        return cheerio.load(html);
    } catch (error) {
        console.error(error);
        return cheerio.load("");
    }
}

// (async() => {
//     const {browser, page} = await initBrowser();
//     const url = "https://anime-sama.fr/catalogue/marchen-crown/";
//     const $ = await getCherrioText(url, page);
//     console.log($.html());

//     await page.close();
//     await browser.close();
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

export async function getEmbedListeMangas(mangas: any[], interaction: CommandInteraction): Promise<void> {
    const RELOUDEMERDE = ["one-piece"]
    const dev = await interaction.client.users.fetch(process.env.DEV!);
    mangas = mangas.sort((a, b) => a.name_manga.localeCompare(b.name_manga));
    const img = (await BDD.getImgFromTest(mangas[0].name_manga!)).publicUrl ?? null;

    const embed = new EmbedBuilder()
        .setTitle(mangas[0].name_manga.replaceAll("-", " "))
        .setURL(`https://anime-sama.fr/catalogue/${mangas[0].name_manga}/scan${RELOUDEMERDE.includes(mangas[0].name_manga!) ? "_noir-et-blanc" : ""}/vf/`)
        .setDescription(`
        ***chapitre n°${mangas[0]?.chapitre_manga}***
        description:
        ${mangas[0]?.synopsis.split(" ").slice(0, 30).join(" ") + " ..."}   
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
            }
            )
        )

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)
    // .addComponents(leftButton, rightButton)

    const rep = await interaction.followUp({ embeds: [embed], components: [row] });

    // const filter = (i: any) => i.user.id === interaction.user.id;
    const collector = rep.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3600000 });


    collector.on("collect", async (i) => {

        const value = i.values[0];

        const manga = mangas.find((manga) => manga.id_manga === parseInt(value));
        const img = (await BDD.getImgFromTest(manga.name_manga!))?.publicUrl ?? null;
        // console.log(img)
        const newEmbed = new EmbedBuilder()
            .setTitle(manga?.name_manga.replaceAll("-", " "))
            .setDescription(`
            ***chapitre n°${manga?.chapitre_manga}***
            description:
            ${manga?.synopsis.split(" ").slice(0, 30).join(" ") + " ..."}    
        `)
            .setURL(`https://anime-sama.fr/catalogue/${manga?.name_manga}/scan${RELOUDEMERDE.includes(manga?.name_manga!) ? "_noir-et-blanc" : ""}/vf/`)
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
    const RELOUDEMERDE = new Map<string, string>()
    .set("hunter-x-hunter", "Hunter%20x%20Hunter")
    .set("kaiju-n8", "Kaiju%20N°8")
    .set("shangri-la-frontier", "Shangri-La%20Frontier")
    .set("the-beginning-after-the-end", "The%20Beginning%20After%20the%20End")
    .set("the-max-level-player-100th-regression", "The%20Max-Level%20Player's%20100th%20Regression")
    .set("unordinary", "unOrdinary")
    .set("valkyrie-apocalypse", "Valkyrie%20apocalypse")

    let name = "";
    if (RELOUDEMERDE.has(mangas.name_manga!)) name = RELOUDEMERDE.get(mangas.name_manga!)!;
    else name = upperCaseFirstLetter(mangas.name_manga!);
    const url = `https://anime-sama.fr/s2/scans/${name}/${chap}/`;

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

