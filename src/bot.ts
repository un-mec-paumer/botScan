import { Client, User } from "discord.js";
import token from "./data/token.json";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import { finder } from "./chercheur";
import mangas from "./data/mangas.json";
import { writeFile } from "fs";

const userID = "452370867758956554";

function finderAll(client:Client) {
    console.log("finderAll");
    mangas.forEach(manga => {
        finder(manga.name, manga.chapitre, manga.pages).then((value) => {
            if(value){
                manga.chapitre++;
                client.users.fetch(userID).then((user:User) => {
                    user.send("Nouveau chapitre de " + manga.name + " : " + "https://fr-scan.cc/manga/" + manga.name + "/chapitre-" + manga.chapitre + "-vf/");
                });
                //console.log( __dirname + "/data/mangas.json " + existsSync( __dirname + "/data/mangas.json"));

                writeFile( __dirname + "/data/mangas.json", JSON.stringify(mangas), (err) => {
                    if(err){
                        console.log(err);
                    }
                });
            }
        });
    });
}



console.log("Bot is starting...");

const client = new Client({
    intents: []
});
//console.log(token.token);
ready(client);
interactionCreate(client);

// console.log(client);

client.login(token.token);

//console.log(client);
const interval = setInterval(finderAll, 1000 * 60, client);
