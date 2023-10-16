import { Client, User } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
import mangas from "./data/mangas.json";
type Manga = {name:string, chapitre:number, pages:boolean, discordUsers:string[]};

async function finder(manga:Manga): Promise<boolean> {
    let url: string = "";
    // let url2: string = "";
    url = "https://scansmangas.me/scan-" + manga.name + "-" + manga.chapitre + "/";

    // console.log(url);
    // console.log(url2);


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
        console.log("https://scansmangas.me/scan-" + manga.name + "-" + (manga.chapitre) + "/", text.includes("https://scansmangas.me/scan-" + manga.name + "-" + (manga.chapitre + 1) + "/"));
        return text.includes("https://scansmangas.me/scan-" + manga.name + "-" + (manga.chapitre + 1) + "/");

        
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// finder("", 0, true).then((value) => {
//     console.log(value);
// });

// async function finderWebtoon(): Promise<boolean> {
//     const url = 'https://webtoon.p.rapidapi.com/canvas/search?query=boy%20friend&startIndex=0&pageSize=20&language=fr';
//     const options = {
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Key': '0ee492367cmsh3c211d62fd9ead0p1a499cjsnb0b789ef8785',
//             'X-RapidAPI-Host': 'webtoon.p.rapidapi.com'
//         }
//     };

//     try {
//         const response = await fetch(url, options);
//         const result = await response.text();
//         console.log(result);
//     } catch (error) {
//         console.error(error);
//     }
//     return true;
// }

// finderWebtoon()

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
