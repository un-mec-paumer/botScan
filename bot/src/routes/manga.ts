import { Request, Response, Router} from "express";
import { BDD } from "../supabase";
import { client } from "../bot";
import { downloadImg, getCherrioText, initBrowser } from "../function";

const mangaRouter = Router();

mangaRouter.get("/", async (req: Request, res: Response) => {
    const data = await BDD.getMangas();
    res.send(data?.map((e) => e.toJSON()) );
});

mangaRouter.post("/mangaImg", async (req: Request, res: Response) => {
    const data = await BDD.getImgFromTest(req.body.name);
    res.send(data);
});

mangaRouter.post("/mangasByToken", async (req: Request, res: Response) => {
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

mangaRouter.post("/mangaByid", async (req: Request, res: Response) => {
    const data = await BDD.getMangaById(parseInt(req.body.id));
    res.send(data?.map((e) => e.toJSON()) );
});

mangaRouter.post("/", async (req: Request, res: Response) => {
    const data = await BDD.getManga(req.body.name);
    res.send(data?.map((e) => e.toJSON()) );
});

mangaRouter.post("/addManga", async (req: Request, res: Response) => {
    const name = req.body.name.toLowerCase().replaceAll(" ", "-");
    const chap = req.body.chapter;
    const IsPage = req.body.page;
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

        if(userBDD?.length !== 1) {
            await BDD.addUser(id_user, userDiscord.username, userDiscord.avatarURL()!);
        }

        await BDD.addLien(manga![0].id_manga, id_user);

        res.send({
            res: true,
            text: "Manga déjà présent vous avez été ajouté à la liste des personnes à prévenir"
        });
        return;
    }

    const url = `https://fr-scan.com/manga/${name}/`;
    const browser = await initBrowser();
    const $ = await getCherrioText(url, browser);
    await browser.close();



    if($(".summary_image img").attr("data-lazy-src") === undefined){
        res.send({
            res: false,
            text: "Manga non trouvable sur le site fr-scan.com"
        });
        return;
    }
    const image = $(".summary_image img").attr("data-lazy-src")
    const synopsis = $(".summary__content").text().trim();
    
    await BDD.addManga(name, chap, IsPage, image!, synopsis);
    downloadImg(image!, name as string);

    if(userBDD?.length === 0){
        const userAvatar = userDiscord.avatarURL();
        await BDD.addUser(id_user, userDiscord.username, userAvatar!);
        res.send({
            res: true,
            text: "Manga ajouté avec succès"
        });
    }
    await BDD.addLien(manga![0].id_manga, userDiscord.id);

    res.send({
        res: true,
        text: "Manga ajouté avec succès"
    });
});

export default mangaRouter;