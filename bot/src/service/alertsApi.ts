import { convertObjectToManga } from "../function"
import Manga from "../model/manga"
import { API_URL } from "../variables"
import { deleteFetch, getFetch, postFetch } from "./fetch"
const ALERT_BASE_URL = `${API_URL}/alerts`

export async function addMangaAlert(id_manga: number, id_user: string) {
    return await postFetch(ALERT_BASE_URL, {
        userId: id_user,
        mangaId: id_manga,
    });
}

// export async function addAnimeAlert(id_anime: number, id_user: string) {
//     return await postFetch(ALERT_BASE_URL, {
//         userId: id_user,
//         animeId: id_anime,
//     });
// }

export async function getAlertsByMangaId(id_manga: number): Promise<Manga[]> {
    const alerts = await getFetch(`${ALERT_BASE_URL}/manga-id/${id_manga}`) as object[];

    return alerts.map((e: object) => convertObjectToManga(e));
}

export async function getAlertsByUserId(id: string): Promise<Manga[]> {
    const alerts = await getFetch(`${ALERT_BASE_URL}/user-id/${id}`) as object[];

    return alerts.map((e: object) => convertObjectToManga(e));
}

// Unused
export async function verifyAlert(id_user: string, id_manga: number) {
    return await getFetch(`${ALERT_BASE_URL}/${id_user}/${id_manga}`);
}

export async function deleteAlert(id_manga: number, id_user: string) {
    return await deleteFetch(`${ALERT_BASE_URL}/${id_user}/${id_manga}`);
}
