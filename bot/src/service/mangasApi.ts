import { convertObjectToManga } from "../function";
import Manga from "../model/manga";
import Source from "../model/source";
import { API_URL } from "../variables";
import { deleteFetch, getFetch, patchFetch, postFetch } from "./fetch";
const MANGA_BASE_URL = `${API_URL}/mangas`

export async function getMangas(): Promise<Manga[] | null> {
    const mangas = await getFetch(MANGA_BASE_URL) as object[];

    return mangas.map((manga) => convertObjectToManga(manga)) || null;
}

export async function getMangaByName(name: string): Promise<Manga | null> {
    const manga = await getFetch(`${MANGA_BASE_URL}/name/${name}`);

    return convertObjectToManga(manga);
}

export async function getMangaById(id: number): Promise<Manga | null> {
    const manga = await getFetch(`${MANGA_BASE_URL}/id/${id}`);

    return convertObjectToManga(manga);
}

// TODO : later
export async function deleteManga(name: string) {
    // deleteFetch(`${MANGA_BASE_URL}/${name}`)
    // const { data, error } = await this.client
    //     .from('mangas')
    //     .delete()
    //     .match({ name_manga: name })
    // return data
}

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

export async function getMangaSources(): Promise<Source[]> {
    return await getFetch(`${MANGA_BASE_URL}/sources`) as Source[];
}
