import { Client, GatewayIntentBits as Intents, User} from "discord.js";
import * as dotenv from 'dotenv'
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import { finderAll, downloadImg } from "./function";
import Express, { Request, Response, NextFunction  } from "express";
import { BDD, randomString } from "./supabase";
import * as cheerio from 'cheerio';

type json = { args: {url:string}, headers: { [key: string]: string }, origin: string, url: string };

dotenv.config()

function ntm() {
    BDD.verifTokens()
}

console.log("Bot is starting...");

const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMessages,
        Intents.DirectMessages,
        Intents.MessageContent,
        Intents.DirectMessageReactions
    ]
});

ready(client);
interactionCreate(client);
messageCreate(client);

// console.log(process.env.TOKEN);
client.login(process.env.TOKEN);
const interval = setInterval(finderAll, 1000 * 60 * 15, client);
const interval2 = setInterval(ntm, 1000);

// client.users.fetch("452370867758956554").then((user) => {
//     console.log(user.avatarURL())
//  });


async function handleConnectionValidation() {
    return new Promise((resolve) => {
        // Attendez la réaction de l'utilisateur
        client.on("messageReactionAdd", async (reaction, reactingUser) => {
            resolve(reaction.emoji.name === "👍");
        });
    });
}

const app = Express();
//
app.use(Express.json());

app.use((req:Request, res:Response, next:NextFunction ) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use(Express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started!");
});



app.get("/", (req: Request, res: Response) => {
    res.send(`Hello World`);
});

app.get("/mangas", (req: Request, res: Response) => {
    BDD.getMangas().then((data) => {
        res.send(data);
    });
})

app.post("/mangaImg", (req: Request, res: Response) => {
    BDD.getImgFromTest(req.body.name).then((data) => {
        res.send(data);
    });
});

app.post("/mangasByToken", (req: Request, res: Response) => {
    BDD.getMangasByToken(req.body.token).then((data) => {
        if(data === undefined || data!.length === 0) {
            res.send({result:"notExist"});
            return;
        }
        let result:any = [];
        data.forEach((e:any) => {
            result.push({
                id: e.id_manga,
                name: e.manga_name,
                chap: e.chapitre_manga,
                page: e.page,
                img: e.img,
                synopsis: e.synopsis
            });
        });     
        res.send(result);
    });
});

app.post("/mangaByid", (req: Request, res: Response) => {
    BDD.getMangaById(parseInt(req.body.id)).then((data) => {
        // console.log("coucou", req);
        res.send(data);
    });
})

app.post("/manga", (req: Request, res: Response) => {
    //console.log(req.body);
    BDD.getManga(req.body.name).then((data) => {
        res.send(data);
    });
})

app.post("/addSub", (req: Request, res: Response) => {
    BDD.addAlerteByToken(req.body.id_manga, req.body.token).then((data) => {
        res.send({res:true});
    });
})

app.post("/deleteSub", (req: Request, res: Response) => {
    BDD.suppAlerteByToken(req.body.id_manga, req.body.token).then((data) => {
        res.send({res:true});
    });
})

app.post("/getSub",async (req: Request, res: Response) => {
    const data = await BDD.getAlerteByToken(req.body.token, req.body.id_manga);
    //console.log(data?.length === 0 ? false : true);
    res.send({sub:data?.length === 0 ? false : true});
})

app.post("/connexion", (req: Request, res: Response) => {
    BDD.getUserByName(req.body.name).then((data) => {
        //console.log(data);

        if(data?.length === 0) {
            res.send({token:"not Exist"});
            return;
        }
        client.users.fetch(data![0].id_user).then((user:User) => {
            //const connectionId = randomString();

            // Stockez cet identifiant de connexion en attente
            //pendingConnections.set(connectionId, user.id);

            user.send("bonjour quelqu'un veut se connecter sur le site ScanManager et nous voudrions savoir si c'est bien vous (pour accepter la connexion :👍 sinon 👎)").then(async () => {
                // Vous n'avez pas besoin de gérer la réaction ici, car vous pouvez le faire dans le gestionnaire de réaction
                handleConnectionValidation().then((value) => {
                    if(value) {
                        BDD.addToken(user.id).then((data) => {
                            res.send({token:data});
                        });
                    }
                    else {
                        res.send({token:"not Accept"});
                    }
                });
                
                //console.log(resVal);
                //res.send(resVal);
            });
        })
    })
})

app.post("/getUser", async (req: Request, res: Response) => {
    //console.log(req.body.token);
    const data = await BDD.getUserInfo(req.body.token)
    // console.log(data);
    if(data === undefined || data!.length === 0) {
        res.send({result:"notExist"});
        return;
    }
    //.catch((err) => {return err});
    //console.log(data);

    res.send(data![0]);
});

app.post("/newUser", async (req: Request, res: Response) => {
    const idDiscord = req.body.id;
    //const name = req.body.name;

    client.users.fetch(idDiscord).then(async (user:User) => {
        //const verif = await BDD.getUser(idDiscord).then((data) => { return data });

        // if(verif?.length !== 0){
        //     res.send({result:"alreadyExist"});
        // }
        //else{
            const avatarURL = user.avatarURL();
            const name = user.username;
            user.send("bonjour quelqu'un veut crée ajouté votre compte sur se bot si il s'agit de vous reagisser avec 👍 pour accespter sinon 👎").then(async () => {
                handleConnectionValidation().then((value) => {
                    if(!value) {
                        res.send({result:"not Accept"}); 
                        return;
                    }
                    BDD.addUser(idDiscord, name, avatarURL!).then((data) => {
                        //res.send({res:true});
    
                        BDD.addToken(idDiscord).then((data) => {
                            res.send({result:data});
                        });
                    });
                    // if(user.globalName === "totodu91") {
                    //     BDD.addToken(idDiscord).then((data) => {
                    //         res.send({result:data});
                    //     });
                    // }
                });
            })
            .catch(() => {
                res.send({result:"not Access to DM"});
            });
        //}
    }).catch(() => {
        res.send({result:"ID not exist in discord"});
    });
});

app.post("/sendMessage", async (req: Request, res: Response) => {
    //console.log(req.body.text);

    const User:User|void = await BDD.getUserByToken(req.body.token).then(async (data) => {
        // console.log(data);
        const res = await client.users.fetch(data![0].user_id).then((user:User) => {
            //console.log("user in: ",user);
            return user;
        });
        return res;
    });

    //console.log("user out: ",User);

    client.users.fetch(process.env.DEV!).then((user:User) => {
        user.send("message de " + User!.username + " : " + req.body.text);
    }).then(() => {
        res.send({res:true});
    })// }).catch((err) => {res.send({res:false})});
});

app.post("/addManga", async (req: Request, res: Response) => {
    const name = req.body.name;
    const chap = req.body.chap;
    const page = req.body.page;
    const token = req.body.token;

    BDD.getManga(name as string).then( async (manga) => {
        if(manga!.length === 1){
            BDD.getUserByToken(token).then((user) => {
                let id_user = user![0].user_id;
                BDD.getUser(id_user).then((user) => {
                    if(user?.length === 1){
                        BDD.getLien(manga![0].id_manga).then((user) => {
                            if(user!.find(id_user => id_user.id_user == id_user) !== undefined){
                                res.send({res:true,text:"tu est déjà dans la liste des personnes à prévenir"});
                            }
                            else{
                                // interaction.followUp({
                                //     ephemeral: true,
                                //     content: "Manga déjà présent je vous ai ajouté à la liste des personnes à prévenir"
                                // });
                                BDD.addLien(manga![0].id_manga, id_user);
                                res.send({res:true,text:"Manga déjà présent je vous ai ajouté à la liste des personnes à prévenir"});
                            }
                        });
                    }
                    else{
                        client.users.fetch(id_user).then((user:User) => {
                            BDD.addUser(id_user, user.username, user.avatarURL()!).then(() => {
                                BDD.addLien(manga![0].id_manga, id_user).then(() => {
                                    // interaction.followUp({
                                    //     ephemeral: true,
                                    //     content: "Manga déjà présent je vous ai ajouté à la liste des personnes à prévenir"
                                    // });
                                    res.send({res:true,text:"Manga déjà présent je vous ai ajouté à la liste des personnes à prévenir"});
                                });
                            });
                        });
                    }
                });
            });
        }
        else{
            //console.log("verif ");
            // let page = interaction.options.get("page")?.value 
            const url = "https://fr-scan.com/manga/" + name + "/"
            const proxyUrl = 'https://httpbin.org/get?url=' + encodeURIComponent(url);


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

            //const text = await verif.text();
            const $ = cheerio.load(text);

            //console.log($(".summary_image img").attr("src"));
            if($(".summary_image img").attr("data-src") === undefined){
                // interaction.followUp({
                //     ephemeral: true,
                //     content: "Manga non trouvable sur le site fr-scan.com"
                // });
                res.send({res:false,text:"Manga non trouvable sur le site fr-scan.com"});
                return;
            }
            const image = $(".summary_image img").attr("data-src")
            // console.log(image);
            const synopsis = $(".summary__content").text().trim();
            //console.log(synopsis)
            
            BDD.addManga(name, chap, page, image!, synopsis).then(() => {
                downloadImg(image!, name as string)
                BDD.getManga(name as string).then((manga) => {
                    BDD.getUserByToken(token).then((user) => {
                        let id_user = user![0].user_id;
                        BDD.getUser(id_user).then((userBDD) => {
                            client.users.fetch(id_user).then((user:User) => {
                                if(userBDD?.length === 0){
                                    const useravatar = user.avatarURL();
                                    BDD.addUser(id_user, user.username, useravatar!).then(() => {
                                        // interaction.followUp({
                                        //     ephemeral: true,
                                        //     content: "Manga ajouté avec succès"
                                        // });
                                        // return;
                                        res.send({res:true,text:"Manga ajouté avec succès"});
                                    });
                                }
                                BDD.addLien(manga![0].id_manga, user.id).then(() => {
                                    // interaction.followUp({
                                    //     ephemeral: true,
                                    //     content: "Manga ajouté avec succès"
                                    // });
                                    res.send({res:true,text:"Manga ajouté avec succès"});
                                });
                            });
                        });
                    });
                });
            });
        }
    });    
});