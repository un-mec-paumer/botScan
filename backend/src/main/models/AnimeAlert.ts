import { ModelAnime } from "./Anime";
import { ModelUser } from "./User";
import { DisplayAnimeAlertDtoType } from "@dtos/animes/alerts/DisplayAnimeAlertDto";

export class ModelAnimeAlert {
    user: ModelUser | null;
    anime: ModelAnime | null;

    constructor(user: ModelUser | null = null, anime: ModelAnime | null = null) {
        this.user = user;
        this.anime = anime;
    }

    display(): DisplayAnimeAlertDtoType {
        return {
            user: this.user?.display(),
            anime: this.anime?.display(),
        };
    }
}
