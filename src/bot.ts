import { Client, GatewayIntentBits as Intents} from "discord.js";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import { finderAll } from "./function";
import Express, { Request, Response, NextFunction } from "express";
import { BDD } from "./supabase";
import mangaRouter from "./routes/manga";
import subRouter from "./routes/subsribe";
import userRouter from "./routes/user";
import { PORT, TOKEN } from "./variables";
// import { Player } from "discord-player";


function ntm() {
    BDD.verifTokens()
}

console.log("Bot is starting...");



export const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMembers,
        Intents.GuildMessages,
        Intents.DirectMessages,
        Intents.MessageContent,
        Intents.DirectMessageReactions,
        Intents.GuildVoiceStates,
        Intents.GuildMessageReactions,
    ]
});

ready(client);
interactionCreate(client);
messageCreate(client);


client.login(TOKEN);
const interval = setInterval(finderAll, 1000 * 60 * 10, client);

const app = Express();
app.use(Express.json());


app.use((req:Request, res:Response, next:NextFunction ) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(Express.urlencoded({ extended: true }));



app.listen(PORT, () => {
    console.log("Server started! Listening on port " + PORT);
});



app.get("/", (req: Request, res: Response) => {
    res.send(`
        <div style="flex-direction: column; text-align: center;">
            <h1>gros troll</h1>
            <img src="https://steamuserimages-a.akamaihd.net/ugc/1728794025257896721/642346AD0CC7D58B5BE103F05108F057427DD163/" alt="troll" width="300px">

            <p> oui c un troll :) </p>
        </div>

    `);
});

app.use("/manga", mangaRouter);
app.use("/subs", subRouter);
app.use("/user", userRouter);
