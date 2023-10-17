import { Client, User } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
// import mangas from "./data/mangas.json";
import { BDD } from "./supabase";

type Manga = {name_manga:string, chapitre_manga:number, page:boolean};

async function finder(manga:Manga): Promise<boolean> {
    let url: string = "";
    // let url2: string = "";
    url = "https://scansmangas.me/scan-" + manga.name_manga + "-" + manga.chapitre_manga + "/";

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
        // console.log(url);
        console.log("https://scansmangas.me/scan-" + manga.name_manga + "-" + (manga.chapitre_manga) + "/", text.includes("https://scansmangas.me/scan-" + manga.name_manga + "-" + (manga.chapitre_manga + 1) + "/"));
        return text.includes("https://scansmangas.me/scan-" + manga.name_manga + "-" + (manga.chapitre_manga + 1) + "/");

        
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

export async function finderAll(client:Client) {
    console.log("finderAll");
    //const userID = "452370867758956554";

    BDD.getMangas().then((mangas) => {
        mangas!.forEach(manga => {
            console.log(manga);
            finder(manga).then((value) => {
                //console.log(value);
                if(value){                    
                    BDD.updateChapitre(manga.name_manga, manga.chapitre_manga + 1);
                    BDD.getLien(manga.id_manga).then((userID) => {
                        userID!.forEach((user) => {
                            client.users.fetch(user.id_user).then((user:User) => {
                                user.send("Le chapitre " + (manga.chapitre_manga + 1) + " de " + manga.name_manga + " est sorti !");
                                user.send("https://scansmangas.me/scan-" + manga.name_manga + "-" + (manga.chapitre_manga + 1) + "/");
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

// finder("ombres-et-lumieres", 219, false).then((value) => {
//     console.log(value);
// });

// BDD.getMangas().then((value) => {
//     console.log(value);
// });
