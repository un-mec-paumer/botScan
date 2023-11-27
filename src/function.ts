import { Client, User } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
// import mangas from "./data/mangas.json";
import { BDD } from "./supabase";



type Manga = {name_manga:string, chapitre_manga:number, page:boolean};

const urlBase = "https://fr-scan.com/manga/"

async function finder(manga:Manga): Promise<boolean> {
    let url: string = "";
    // let url2: string = "";
    if(!manga.page) url = urlBase + manga.name_manga + "/chapitre-" + manga.chapitre_manga + "-vf/";
    else url = urlBase + manga.name_manga + "/chapitre-" + manga.chapitre_manga + "-vf/p/100000";

    // console.log(url);
    // console.log(url2);


    // console.log(manga.chapitre_manga);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
            },
        });

        //manga.chapitre_manga++;
        const text = await response.text();
        //console.log(text);
        //console.log(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga) + "-vf/", text.includes(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga + 1) + "-vf/"));
        return text.includes(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga + 1) + "-vf/");

        
    } catch (error) {
        console.log("veux pas");
        console.error('Error:', error);
        return false;
    }
}

export async function finderAll(client:Client) {
    console.log("finderAll");
    //const userID = "452370867758956554";

    BDD.getMangas().then((mangas) => {
        mangas!.forEach(manga => {
            //console.log(manga);
            finder(manga).then((value) => {
                //console.log(value);
                if(value){
                    console.log("Le chapitre " + (manga.chapitre_manga + 1) + " de " + manga.name_manga + " est sorti !");                    
                    BDD.updateChapitre(manga.name_manga, manga.chapitre_manga + 1).then(() => {
                        BDD.getLien(manga.id_manga).then((userID) => {
                            userID!.forEach((user) => {
                                client.users.fetch(user.id_user).then((user:User) => {
                                    user.send("Le chapitre " + (manga.chapitre_manga + 1) + " de " + manga.name_manga + " est sorti !");
                                    user.send(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga + 1) + "-vf/");
                                });
                            });
                        });
                    });
                }
            });
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

    const img = await response.arrayBuffer().then((buffer: ArrayBuffer) => buffer);
    BDD.addImgToTest(name_manga + ".png", img)
    
}


// finderAll();
// downloadImg()