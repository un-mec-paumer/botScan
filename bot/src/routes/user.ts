import { Request, Response, Router } from "express";
import { BDD } from "../supabase";
import { User } from "discord.js";
import { client } from "../bot";
import { DEV } from "../variables";

const userRouter = Router();

async function handleConnectionValidation() {
    return new Promise((resolve) => {
        client.on("messageReactionAdd", async (reaction, reactingUser) => {
            resolve(reaction.emoji.name === "👍");
        });
    });
}


userRouter.post("/connexion", async (req: Request, res: Response) => {
    const data = await BDD.getUserByName(req.body.name);

    if(data?.length === 0) {
        res.send({token:"not Exist"});
        return;
    }
    
    const userDiscord = await client.users.fetch(data![0].id_user);

    // Stockez cet identifiant de connexion en attente
    if(userDiscord.dmChannel === null) await userDiscord.createDM();
    await userDiscord.send("Bonjour quelqu'un veut se connecter sur le site ScanManager et nous voudrions savoir si c'est bien vous (pour accepter la connexion :👍 sinon 👎)");
    // Vous n'avez pas besoin de gérer la réaction ici, car vous pouvez le faire dans le gestionnaire de réaction
    const value = await handleConnectionValidation();
    if(!value) { res.send({token:"not Accept"}); }

    const tokenData = await BDD.addToken(userDiscord.id);
    res.send({token:tokenData});
});

userRouter.post("/getUser", async (req: Request, res: Response) => {
    const data = await BDD.getUserInfo(req.body.token)
    if(data === undefined || data!.length === 0) {
        res.send({result:"notExist"});
        return;
    }


    res.send(data![0]);
});

userRouter.post("/newUser", async (req: Request, res: Response) => {
    const idDiscord = req.body.id;
    //const name = req.body.name;

    try {
        const userDiscord = await client.users.fetch(idDiscord);

        const avatarURL = userDiscord.avatarURL();
        const name = userDiscord.username;
        if(userDiscord.dmChannel === null) await userDiscord.createDM();
        await userDiscord.send("Bonjour quelqu'un veut créer / ajouter votre compte sur ce bot s'il s'agit de vous réagissez avec 👍 pour accepter sinon 👎");
        const value = await handleConnectionValidation();
        if(!value) {
            res.send({result:"not Accept"}); 
            return;
        }
        try {
            await BDD.addUser(idDiscord, name, avatarURL!);

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

userRouter.post("/sendMessage", async (req: Request, res: Response) => {
    const response = await BDD.getUserByToken(req.body.token);
    const userDiscord: User|void = await client.users.fetch(response![0].user_id);


    client.users.fetch(DEV).then((user:User) => {
        user.send(`Message de ${userDiscord!.username} : ${req.body.text}`);
    }).then(() => {
        res.send({res:true});
    })
});

export default userRouter;