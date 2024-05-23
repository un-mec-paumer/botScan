import { Client, GatewayIntentBits as Intents, User} from "discord.js";
import * as dotenv from 'dotenv'
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import { finderAll, downloadImg, getCherrioText } from "./function";
import Express, { Request, Response, NextFunction  } from "express";
import { BDD } from "./supabase";
import { Player } from "discord-player";

dotenv.config()

function ntm() {
    BDD.verifTokens()
}

console.log("Bot is starting...");



const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMembers,
        Intents.GuildMessages,
        Intents.DirectMessages,
        Intents.MessageContent,
        Intents.DirectMessageReactions,
        Intents.GuildVoiceStates
    ]
});


client.player = new Player(client, {
    ytdlOptions: {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

client.player.extractors.loadDefault()

ready(client);
interactionCreate(client);
messageCreate(client);


client.login(process.env.TOKEN);
const interval = setInterval(finderAll, 1000 * 60 * 1, client);
const interval2 = setInterval(ntm, 1000);

// client.users.fetch("452370867758956554").then((user) => {
//     console.log(user.avatarURL())
//  });

// console.log("hello world")
// async function test() {
//     const Guilds = await client.guilds.fetch("1039531159866060830")
//     console.log(Guilds.members.list());
// }
// test();
//console.log(client.guilds.cache.get(Guilds[0]));
// Guilds.forEach((guild) => {
//     client.guilds.fetch(guild).then((guild) => {
//         guild.members.fetch().then((members) => {
//             members.forEach((member) => {
//                 console.log(member.user.username);
//                 //console.log(member.user.avatarURL());
//             });
//         });
//     });
// });

async function handleConnectionValidation() {
    return new Promise((resolve) => {
        // Attendez la réaction de l'utilisateur
        client.on("messageReactionAdd", async (reaction, reactingUser) => {
            resolve(reaction.emoji.name === "👍");
        });
    });
}

const app = Express();
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

app.get("/mangas", async (req: Request, res: Response) => {
    const data = await BDD.getMangas();
    res.send(data);
});

app.post("/mangaImg", async (req: Request, res: Response) => {
    const data = await BDD.getImgFromTest(req.body.name);
    res.send(data);
});

app.post("/mangasByToken", async (req: Request, res: Response) => {
    const data = await BDD.getMangasByToken(req.body.token);
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

app.post("/mangaByid", async (req: Request, res: Response) => {
    const data = await BDD.getMangaById(parseInt(req.body.id));
    // console.log("coucou", req);
    res.send(data);
});

app.post("/manga", async (req: Request, res: Response) => {
    //console.log(req.body);
    const data = await BDD.getManga(req.body.name);
    res.send(data);
});

app.post("/addSub", async (req: Request, res: Response) => {
    const data = await BDD.addAlerteByToken(req.body.id_manga, req.body.token);
    res.send({res:true});
});

app.post("/deleteSub", async (req: Request, res: Response) => {
    const data = await BDD.suppAlerteByToken(req.body.id_manga, req.body.token);
    res.send({res:true});
});

app.post("/getSub",async (req: Request, res: Response) => {
    const data = await BDD.getAlerteByToken(req.body.token, req.body.id_manga);
    //console.log(data?.length !== 0);
    res.send({sub:data?.length !== 0});
});

app.post("/connexion", async (req: Request, res: Response) => {
    const data = await BDD.getUserByName(req.body.name);
        //console.log(data);

    if(data?.length === 0) {
        res.send({token:"not Exist"});
        return;
    }
    
    const userDiscord = await client.users.fetch(data![0].id_user);
    //const connectionId = randomString();

    // Stockez cet identifiant de connexion en attente
    //pendingConnections.set(connectionId, user.id);

    await userDiscord.send("Bonjour quelqu'un veut se connecter sur le site ScanManager et nous voudrions savoir si c'est bien vous (pour accepter la connexion :👍 sinon 👎)");
    // Vous n'avez pas besoin de gérer la réaction ici, car vous pouvez le faire dans le gestionnaire de réaction
    const value = await handleConnectionValidation();
    if(!value) { res.send({token:"not Accept"}); }

    const tokenData = await BDD.addToken(userDiscord.id);
    res.send({token:tokenData});

    //console.log(resVal);
    //res.send(resVal);
});

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

    try {
        const userDiscord = await client.users.fetch(idDiscord);
        //const verif = await BDD.getUser(idDiscord).then((data) => { return data });

        // if(verif?.length !== 0){
        //     res.send({result:"alreadyExist"});
        // }
        //else{
        const avatarURL = userDiscord.avatarURL();
        const name = userDiscord.username;
        await userDiscord.send("Bonjour quelqu'un veut créer / ajouter votre compte sur ce bot s'il s'agit de vous réagissez avec 👍 pour accepter sinon 👎");
        const value = await handleConnectionValidation();
        if(!value) {
            res.send({result:"not Accept"}); 
            return;
        }
        try {
            await BDD.addUser(idDiscord, name, avatarURL!);
            //res.send({res:true});

            const data = await BDD.addToken(idDiscord);
            res.send({result:data});
            //* bloc de code ne servant à rien mais wallah on sait jamais vérifie avant de supprimer
            // if(user.globalName === "totodu91") {
            //     BDD.addToken(idDiscord).then((data) => {
            //         res.send({result:data});
            //     });
            // }
        } catch(error) {
            res.send({result:"not Access to DM"});
        };
        //}
    } catch (error) {
        res.send({result:"ID not exist in discord"});
    };
});

app.post("/sendMessage", async (req: Request, res: Response) => {
    //console.log(req.body.text);

    const response = await BDD.getUserByToken(req.body.token);
    const userDiscord: User|void = await client.users.fetch(response![0].user_id);

    //console.log("user out: ",User);

    client.users.fetch(process.env.DEV!).then((user:User) => {
        user.send(`Message de ${userDiscord!.username} : ${req.body.text}`);
    }).then(() => {
        res.send({res:true});
    })// }).catch((err) => {res.send({res:false})});
});

app.post("/addManga", async (req: Request, res: Response) => {
    const name = req.body.name.toLowerCase().replaceAll(" ", "-");
    const chap = req.body.chapter;
    const page = req.body.page;
    const token = req.body.token;

    const manga = await BDD.getManga(name as string);
    const userBDD = await BDD.getUserByToken(token);
    const id_user = userBDD![0].user_id;
    const userDiscord = await client.users.fetch(id_user);

    if(manga!.length === 1) {

        const userTest = await BDD.getLien(manga![0].id_manga);
        if(userTest!.find(id_user => id_user.id_user == id_user) !== undefined){
            res.send({
                res: true,
                text: "Vous êtes déjà dans la liste des personnes à prévenir"
            });
            return;
        }

        // const user2 = await BDD.getUser(id_user);
        // utiliser user2 dans le if si ça marche pas
        if(userBDD?.length !== 1) {
            await BDD.addUser(id_user, userDiscord.username, userDiscord.avatarURL()!);
        }

        await BDD.addLien(manga![0].id_manga, id_user);
        // interaction.followUp({
        //     ephemeral: true,
        //     content: "Manga déjà présent vous avez été ajouté à la liste des personnes à prévenir"
        // });
        res.send({
            res: true,
            text: "Manga déjà présent vous avez été ajouté à la liste des personnes à prévenir"
        });
        return;
    }

    //console.log("verif ");
    // let page = interaction.options.get("page")?.value;
    const url = `https://fr-scan.com/manga/${name}/`;

    const $ = await getCherrioText(url);

    //console.log($(".summary_image img").attr("src"))
    if($(".summary_image img").attr("data-lazy-src") === undefined){
        // interaction.followUp({
        //     ephemeral: true,
        //     content: "Manga non trouvable sur le site fr-scan.com"
        // });
        res.send({
            res: false,
            text: "Manga non trouvable sur le site fr-scan.com"
        });
        return;
    }
    const image = $(".summary_image img").attr("data-lazy-src")
    // console.log(image);
    const synopsis = $(".summary__content").text().trim();
    //console.log(synopsis)
    
    await BDD.addManga(name, chap, page, image!, synopsis);
    downloadImg(image!, name as string);

    // const user2 = await BDD.getUser(id_user);
    // utiliser user2 à la palce de userBDD si ça marche pas
    if(userBDD?.length === 0){
        const userAvatar = userDiscord.avatarURL();
        await BDD.addUser(id_user, userDiscord.username, userAvatar!);
        // interaction.followUp({
        //     ephemeral: true,
        //     content: "Manga ajouté avec succès"
        // });
        // return;
        res.send({
            res: true,
            text: "Manga ajouté avec succès"
        });
    }
    await BDD.addLien(manga![0].id_manga, userDiscord.id);
    // interaction.followUp({
    //     ephemeral: true,
    //     content: "Manga ajouté avec succès"
    // });
    res.send({
        res: true,
        text: "Manga ajouté avec succès"
    });
});
