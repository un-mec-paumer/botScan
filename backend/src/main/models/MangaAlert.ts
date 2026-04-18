import { ModelManga } from "./Manga";
import { ModelUser } from "./User";
import { DisplayMangaAlertDtoType } from "@dtos/mangas/alerts/DisplayMangaAlertDto";

export class ModelMangaAlert {
    user: ModelUser | null;
    manga: ModelManga | null;

    constructor(user: ModelUser | null = null, manga: ModelManga | null = null) {
        this.user = user;
        this.manga = manga;
    }

    display(): DisplayMangaAlertDtoType {
        return {
            user: this.user?.display(),
            manga: this.manga?.display(),
        };
    }
}
