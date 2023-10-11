import { Client, User } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
import mangas from "./data/mangas.json";
type Manga = {name:string, chapitre:number, pages:boolean, discordUsers:string[]};

async function finder(manga:Manga): Promise<boolean> {
    let url: string = "";
    let url2: string = "";
    if(manga.pages){
        url = "https://fr-scan.cc/manga/" + manga.name + "/chapitre-" + manga.chapitre + "-vf/p/1000000";
        manga.chapitre++;
        url2 = "https://fr-scan.cc/manga/" + manga.name + "/chapitre-" + manga.chapitre + "-vf/";
    }
    else{
        url = "https://fr-scan.cc/manga/" + manga.name + "/chapitre-" + manga.chapitre + "-vf/";
        manga.chapitre++;
        url2 = "https://fr-scan.cc/manga/" + manga.name + "/chapitre-" + manga.chapitre + "-vf/";
    }

    // console.log(url);
    // console.log(url2);

    manga.chapitre--;

    // console.log(manga.chapitre);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
            },
        });

        //manga.chapitre++;
        const text = await response.text();
        // console.log(url);
        // console.log(text.includes(url2));
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
                sauvegarder(JSON.stringify(mangas));
            }
        });
    });
}
// finderAll();

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
