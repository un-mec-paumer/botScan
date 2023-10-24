import { Client, GatewayIntentBits as Intents} from "discord.js";
import * as dotenv from 'dotenv'
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import { finderAll } from "./function";
import Express, { Request, Response } from "express";
import { BDD } from "./supabase";

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

const app = Express();

app.use(Express.json());

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
    BDD.addLien(req.body.id, req.body.name).then((data) => {
        res.send(data);
    });
})

app.post("/getSub", (req: Request, res: Response) => {
    BDD.getLien(req.body.id).then((data) => {
        res.send(data);
    });
})

app.post("/connexion", (req: Request, res: Response) => {
    client.users.fetch(req.body.id).then((user) => {
        user.send("bonjour quelqu'un veux se connecté sur le site ScanManager et nous voudrions si c'est bien vous (pour accepter la connexion :👍 sinon 👎)").then((message) => {
            // message.react("👍");
            // message.react("👎");
            client.on("messageReactionAdd", (reaction, user) => {
                if (reaction.emoji.name === "👍") {
                    //console.log("coucou");
                    res.send(BDD.addToken(req.body.id));
                }
                else if (reaction.emoji.name === "👎") {
                    res.send("non");
                }
            });
        });
    });
})