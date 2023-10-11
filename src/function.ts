import { Client, User } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
import mangas from "./data/mangas.json";
type Manga = {name:string, chapitre:number, pages:boolean, discordUsers:string[]};

async function finder(manga:Manga): Promise<boolean> {
    let url: string = "";
    let url2: string = "";
    if(manga.pages){
        url = "https://fr-scan.cc/manga/" + manga.name + "/chapitre-" + manga.chapitre + "-vf/p/1";
        url2 = "https://fr-scan.cc/manga/" + manga.name + "/chapitre-" + manga.chapitre++ + "-vf/p/100000";
    }
    else{
        url = "https://fr-scan.cc/manga/" + manga.name + "/chapitre-" + manga.chapitre + "-vf/";
        url2 = "https://fr-scan.cc/manga/" + manga.name + "/chapitre-" + manga.chapitre++ + "-vf/";
    }

    manga.chapitre--;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
            },
        });

        //manga.chapitre++;
        const text = await response.text();
        // console.log(text);
        return text.includes(url2)

        
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// finder("", 0, true).then((value) => {
//     console.log(value);
// });


export async function finderAll(client:Client) {
    console.log("finderAll");
    //const userID = "452370867758956554";

    mangas.forEach(manga => {
        finder(manga).then((value) => {
            //console.log(value);
            if(value){
                manga.chapitre++;
                manga.discordUsers.forEach(userID => {
                    client.users.fetch(userID).then((user:User) => {
                        user.send("Nouveau chapitre de " + manga.name + " : " + "https://fr-scan.cc/manga/" + manga.name + "/chapitre-" + manga.chapitre + "-vf/");
                    });
                });

            }
        });
    });
}
// finderAll();

export function sauvegarder(data:string, path:PathOrFileDescriptor):boolean {
    //console.log("data ", data);
    //let str = JSON.stringify(data);
    writeFileSync(path, data, "utf-8");
    return true;
}

// finder("ombres-et-lumieres", 219, false).then((value) => {
//     console.log(value);
// });
