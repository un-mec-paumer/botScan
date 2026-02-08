import { Request, Response, Router} from "express";
import { BDD } from "../supabase";

const subRouter = Router();


subRouter.post("/addSub", async (req: Request, res: Response) => {
    const data = await BDD.addAlerteByToken(req.body.id_manga, req.body.token);
    res.send({res:true});
});

subRouter.post("/deleteSub", async (req: Request, res: Response) => {
    const data = await BDD.suppAlerteByToken(req.body.id_manga, req.body.token);
    res.send({res:true});
});

subRouter.post("/getSub",async (req: Request, res: Response) => {
    const data = await BDD.getAlerteByToken(req.body.token, req.body.id_manga);
    res.send({sub:data?.length !== 0});
});

export default subRouter;