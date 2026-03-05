import { convertAnytoManga } from "../function";
import Manga from "../model/manga";
import { API_URL } from "../variables";
import { deleteFetch, getFetch, patchFetch, postFetch } from "./fetch";
const MANGA_BASE_URL = `${API_URL}/works/mangas`

export async function getMangas(): Promise<Manga[] | null> {
    const mangas = await getFetch(MANGA_BASE_URL);

    return mangas!.map((manga: object) => convertAnytoManga(manga)) || null;
}

export async function getMangaByName(name: string): Promise<Manga | null> {
    const manga = await getFetch(`${MANGA_BASE_URL}/name/${name}`);

    return convertAnytoManga(manga);
}

export async function getMangaById(id: number): Promise<Manga | null> {
    const manga = await getFetch(`${MANGA_BASE_URL}/id/${id}`);

    return convertAnytoManga(manga);
}

// TODO : later
/*export async function supprimerManga(name: string) {
    deleteFetch()
    const { data, error } = await this.client
        .from('mangas')
        .delete()
        .match({ name_manga: name })
    return data
}*/

export async function addManga(name: string, chapter: number, page: boolean, image: string, synopsis: string): Promise<boolean> {
    const response = await postFetch(MANGA_BASE_URL, {
        name,
        synopsis,
        chapter,
        page,
        image,
    })

    return Boolean(response)
}

export async function updateChapter(id_manga: number, chapter: number): Promise<boolean> {
    const response = await patchFetch(`${MANGA_BASE_URL}/update-chapter/${id_manga}`, { chapter })

    return Boolean(response);
}
