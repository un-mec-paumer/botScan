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

const pendingConnections = new Map();

async function handleConnectionValidation(user:string, res:Response) {
    return new Promise((resolve) => {
        // Attendez la réaction de l'utilisateur
        client.on("messageReactionAdd", async (reaction, reactingUser) => {
            if (reaction.emoji.name === "👍") {
                resolve({ token: await BDD.addToken(user) });
            } else {
                resolve({token:"non"});
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
        res.send(true);
    });
})

app.post("/deleteSub", (req: Request, res: Response) => {
    BDD.suppAlerteByToken(req.body.id_manga, req.body.token).then((data) => {
        res.send(true);
    });
})

app.post("/getSub", (req: Request, res: Response) => {
    BDD.getLien(req.body.id).then((data) => {
        res.send(data);
    });
})

app.post("/connexion", (req: Request, res: Response) => {
    BDD.getUserByName(req.body.name).then((data) => {
        //console.log(data);
        client.users.fetch(data![0].id_user).then((user) => {
            const connectionId = randomString();

            // Stockez cet identifiant de connexion en attente
            //pendingConnections.set(connectionId, user.id);

            user.send("bonjour quelqu'un veut se connecter sur le site ScanManager et nous voudrions savoir si c'est bien vous (pour accepter la connexion :👍 sinon 👎)").then(async (message) => {
                // Vous n'avez pas besoin de gérer la réaction ici

                let resVal = await handleConnectionValidation(user.id, res); 
                
                //console.log(resVal);
                res.send(resVal);
            });
        });
    });
})