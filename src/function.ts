import { Client, User } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
// import mangas from "./data/mangas.json";
import { BDD } from "./supabase";
import * as cheerio from 'cheerio';



type Manga = {id_manga:number, name_manga:string, chapitre_manga:number, page:boolean};
type json = { args: {url:string}, headers: { [key: string]: string }, origin: string, url: string };

const urlBase = "https://fr-scan.com/manga/"

async function finder(manga:Manga, client:Client) /*Promise<boolean>*/ {
    let url: string = "";
    let chap = String(manga.chapitre_manga).replace(".", "-");
    // let url2: string = "";
    // url = urlBase + manga.name_manga + "/";
    // const url = urlBase + "one-piece/chapitre-1099-vf/p/100000/";
    
    if(!manga.page) url = urlBase + manga.name_manga + "/chapitre-" + (chap) + "-vf/";
    else url = urlBase + manga.name_manga + "/chapitre-" + (chap) + "-vf/p/1000000";
    const proxyUrl = 'https://httpbin.org/get?url=' + encodeURIComponent(url);
    //console.log(url);
    // console.log(url2);


    //console.log(manga.chapitre_manga);

    try {
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
                'User-Agent': 'PostmanRuntime/7.32.1',
            },
        });

        const json = await response.json() as json;
        const text = await fetch(json.args.url, json.headers).then(async (response) => {
            const text = await response.text();
            return text;
        })
        // console.log(text);
        const $ = cheerio.load(text);
        const nextUrl = $(".next_page").attr("href");
        // console.log(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga) + "-vf/", text.includes(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga + 1) + "-vf/"));
        //return text.includes(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga + 1) + "-vf/");
        
        if(nextUrl !== undefined && nextUrl !== null && nextUrl !== "") {
            console.log("nextUrl ", nextUrl);
            const tab = nextUrl!.split("/")[5].split("-");
            let nbNext = parseFloat(tab[1]);
            if(tab[2] !== "vf") nbNext += parseFloat("0." +parseFloat(tab[2]));
            //console.log(nbNext);

            console.log("Le chapitre " + (nbNext) + " de " + manga.name_manga + " est sorti !");                    
            BDD.updateChapitre(manga.name_manga, nbNext).then(() => {
                BDD.getLien(manga.id_manga).then((userID) => {
                    userID!.forEach((user) => {
                        client.users.fetch(user.id_user).then((user:User) => {
                            user.send("Le chapitre " + (nbNext) + " de " + manga.name_manga.replaceAll("-", " ") + " est sorti !");
                            if(tab[2] !== "vf") user.send(urlBase + manga.name_manga + "/chapitre-" + (parseFloat(tab[1]) + "-" + (parseFloat(tab[2])) + "-vf/"));
                            else user.send(urlBase + manga.name_manga + "/chapitre-" + (nbNext) + "-vf/");
                        });
                    });
                });
            });
            
        }
        // else return false;
        
    } catch (error) {
        console.log("veux pas");
        console.error('Error:', error);
        // return false;
    }
}

export async function finderAll(client:Client) {
    console.log("finderAll");
    //const userID = "452370867758956554";

    BDD.getMangas().then((mangas) => {
        //console.log(mangas)
        mangas!.forEach(manga => {
            finder(manga, client)
        });
    });
}


export function sauvegarder(data:string/*, path:PathOrFileDescriptor*/):boolean {
    //console.log("data ", data);
    //let str = JSON.stringify(data);
    let path2:PathOrFileDescriptor = "./src/data/mangas.json";
    writeFileSync(path2, data, "utf-8");
    return true;
}

export async function downloadImg(imgStr:string, name_manga:string) {
    
    const response = await fetch(imgStr, {
        method: 'GET',
        headers: {
            'Content-Type': 'image/png',
        },
    });
    // console.log(response);

    const img = await response.arrayBuffer().then((buffer: ArrayBuffer) => buffer);
    // console.log(img);
    BDD.addImgToTest(name_manga + ".png", img)
    
}
// downloadImg('https://fr-scan.com/wp-content/uploads/2022/09/shuumatsu_no_valkyrie_ibun_-_ryo_fu_hou_sen_hishouden_vol_3945333-193x278.jpg', "test")

// finderAll();
// downloadImg()