import { Client, GatewayIntentBits as Intents} from "discord.js";
import * as dotenv from 'dotenv'
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import { finderAll } from "./function";
import Express, { Request, Response } from "express";
import { BDD, randomString } from "./supabase";

dotenv.config()

console.log("Bot is starting...");

const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMessages,
        Intents.DirectMessages,
        Intents.MessageContent,
        Intents.DirectMessageReactions,
    ]
});

ready(client);
interactionCreate(client);
messageCreate(client);

// console.log(process.env.TOKEN);
client.login(process.env.TOKEN);
// const interval = setInterval(finderAll, 1000 * 60 * 10, client);
// const interval2 = setInterval(BDD.verifTokens, 1000, client);

// client.users.fetch("452370867758956554").then((user) => {
//     console.log(user.avatarURL())
// });


async function handleConnectionValidation() {
    return new Promise((resolve) => {
        // Attendez la réaction de l'utilisateur
        client.on("messageReactionAdd", async (reaction, reactingUser) => {
            if (reaction.emoji.name === "👍") {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

async function handleCreateUser() {
    return new Promise((resolve) => {
        // Attendez la réaction de l'utilisateur
        client.on("messageReactionAdd", async (reaction, reactingUser) => {
            if (reaction.emoji.name === "👍") {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

const app = Express();

app.use(Express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use(Express.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log("Server started!");
});



app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
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
    console.log(req.body);
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
        client.users.fetch(data![0].id_user).then((user) => {
            //const connectionId = randomString();

            // Stockez cet identifiant de connexion en attente
            //pendingConnections.set(connectionId, user.id);

            user.send("bonjour quelqu'un veut se connecter sur le site ScanManager et nous voudrions savoir si c'est bien vous (pour accepter la connexion :👍 sinon 👎)").then(async (message) => {
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
    console.log(req.body.token);
    const data = await BDD.getUserInfo(req.body.token)
    // console.log(data);
    if(data === undefined) {
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

    client.users.fetch(idDiscord).then(async (user) => {
        //const verif = await BDD.getUser(idDiscord).then((data) => { return data });

        // if(verif?.length !== 0){
        //     res.send({result:"alreadyExist"});
        // }
        //else{
            const avatarURL = user.avatarURL();
            const name = user.username;
            user.send("bonjour quelqu'un veut crée ajouté votre compte sur se bot si il s'agit de vous reagisser avec 👍 pour accespter sinon 👎").then(async (message) => {
                handleCreateUser().then((value) => {
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
            .catch((err) => {
                res.send({result:"not Access to DM"});
            });
        //}
    }).catch((err) => {
        res.send({result:"ID not exist in discord"});
    });
});