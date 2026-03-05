import { convertAnytoManga } from "../function"
import Manga from "../model/manga"
import { API_URL } from "../variables"
import { getFetch, postFetch } from "./fetch"
const USER_BASE_URL = `${API_URL}/users`

export async function addUser(id: string, name: string, img: string) {
    return await postFetch(USER_BASE_URL, { id, name, img })
}

export async function getUser(id: string) {
    return await getFetch(USER_BASE_URL, { id })
}

export async function getAlertsByUserId(id: string) : Promise<Manga[] | null> {
    const mangas = await getFetch(`${USER_BASE_URL}/manga-alerts`, { id })

    return mangas?.map((e: any) => convertAnytoManga(e)) || null;
}
