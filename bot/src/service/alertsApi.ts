import { convertAnytoManga } from "../function"
import Manga from "../model/manga"
import { API_URL } from "../variables"
import { deleteFetch, getFetch, patchFetch, postFetch } from "./fetch"
const ALERT_BASE_URL = `${API_URL}/alerts`

export async function addMangaAlert(id_manga: number, id_user: string) {
    return await postFetch(ALERT_BASE_URL, {
        userId: id_user,
        workId: id_manga,
        mangaAlert: true,
    });
}

export async function addAnimeAlert(id_manga: number, id_user: string) {
    return await postFetch(ALERT_BASE_URL, {
        userId: id_user,
        workId: id_manga,
        animeAlert: true,
    });
}

export async function updateAlert(id_manga: number, id_user: string, mangaAlert: boolean | null, animeAlert: boolean | null) {
    return await patchFetch(ALERT_BASE_URL, {
        userId: id_user,
        workId: id_manga,
        mangaAlert,
        animeAlert,
    });
}

export async function getAlertsByWorkId(id_manga: number) {
    const alerts = await getFetch(`${ALERT_BASE_URL}/work-id/${id_manga}`)

    return alerts?.map((e: any) => convertAnytoManga(e)) || null;
}

export async function getAlertsByUserId(id: string): Promise<Manga[] | null> {
    const alerts = await getFetch(`${ALERT_BASE_URL}/user-id/${id}`)

    return alerts?.map((e: any) => convertAnytoManga(e)) || null;
}

export async function verifyAlert(id_user: string, id_manga: number) {
    return await getFetch(`${ALERT_BASE_URL}/${id_user}/${id_manga}`);
}

export async function deleteAlert(id_manga: number, id_user: string) {
    return await deleteFetch(`${ALERT_BASE_URL}/${id_user}/${id_manga}`);
}
