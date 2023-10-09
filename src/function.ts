import { Client, User } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
import mangas from "./data/mangas.json";

async function finder(manga: string, chapitre: number, page: boolean): Promise<boolean> {
    let url: string;
    // if (page) {
    //     url = "https://fr-scan.cc/manga/" + manga + "/chapitre-" + chapitre + "-vf/p/10000/";
    // } else {
    //     url = "https://fr-scan.cc/manga/" + manga + "/chapitre-" + chapitre + "-vf/";
    // }

    url = "https://phenixscans.fr/nano-machine-chapitre-173/";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
            },
        });

        chapitre++;
        const text = await response.text();
        // console.log(text);
        return text.includes('https://fr-scan.cc/manga/' + manga + '/chapitre-' + chapitre + '-vf/');
        //return text.includes('https://phenixscans.fr/wp-content/themes/mangastream/assets/images/404.png')
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

finder("", 0, true).then((value) => {
    console.log(value);
});


export async function finderAll(client:Client) {
    console.log("finderAll");
    //const userID = "452370867758956554";

    mangas.forEach(manga => {
        finder(manga.name, manga.chapitre, manga.pages).then((value) => {
            if(value){
                manga.chapitre++;
                manga.discordUsers.forEach(userID => {
                    client.users.fetch(userID).then((user:User) => {
                        user.send("Nouveau chapitre de " + manga.name + " : " + "https://fr-scan.cc/manga/" + manga.name + "/chapitre-" + manga.chapitre + "-vf/");
                    });
                });
                //console.log( __dirname + "/data/mangas.json " + existsSync( __dirname + "/data/mangas.json"));

                // writeFile( __dirname + "/data/mangas.json", JSON.stringify(mangas), (err) => {
                //     if(err){
                //         console.log(err);
                //     }
                // });
            }
        });
    });
}

export function sauvegarder(data:string, path:PathOrFileDescriptor):boolean {
    //console.log("data ", data);
    //let str = JSON.stringify(data);
    writeFileSync(path, data, "utf-8");
    return true;
}

// finder("ombres-et-lumieres", 219, false).then((value) => {
//     console.log(value);
// });
