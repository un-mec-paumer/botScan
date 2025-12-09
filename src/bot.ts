import { Client, GatewayIntentBits as Intents, User} from "discord.js";
import * as dotenv from 'dotenv'
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";
import { finderAll } from "./function";
import Express, { Request, Response, NextFunction } from "express";
import { BDD } from "./supabase";
import mangaRouter from "./routes/manga";
import subRouter from "./routes/subsribe";
import userRouter from "./routes/user";
import path from "path";
// import { Player } from "discord-player";

dotenv.config()

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


client.login(process.env.TOKEN);
const interval = setInterval(finderAll, 1000 * 60 * 10, client);

const app = Express();
app.use(Express.json());


app.use((req:Request, res:Response, next:NextFunction ) => {
    res.header('Access-Control-Allow-Origin', "same-origin");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(Express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started! Listening on port " + PORT);
});

app.use(Express.static(path.join(__dirname, 'public')));

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/public/html/index.html");
});

app.use("/mangas", mangaRouter);
app.use("/subs", subRouter);
app.use("/user", userRouter);
