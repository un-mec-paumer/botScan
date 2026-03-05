import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { randomInt } from 'crypto'
import Manga from './model/manga';
import MangaRelou from './model/manga/mangaRelou';

import AnimeSama from './model/site/AnimeSama';
import MangaMoins from './model/site/MangaMoins';
import MangaPlus from './model/site/MangaPlus';

import { SUPABASE_EMAIL, SUPABASE_KEY, SUPABASE_PASSWORD, SUPABASE_URL } from './variables';
import { convertAnytoManga } from './function';


export function randomString() {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    let random: number;
    for (let i = 0; i < 32; i++) {
        random = randomInt(0, charactersLength)
        result += characters.charAt(random);
    }
    return result;
}

class Supabase {
    private url!: string;
    private key!: string;

    private client!: SupabaseClient;
    protected static Instance: Supabase;

    public static get instance(): Supabase {
        if (Supabase.Instance === undefined || Supabase.Instance === null) {
            Supabase.Instance = new Supabase();
        }
        return Supabase.Instance;
    }

    private constructor() {
        this.url = SUPABASE_URL!
        this.key = SUPABASE_KEY!

        this.client = createClient(this.url, this.key)

        this.client.auth.signInWithPassword({
            email: SUPABASE_EMAIL!,
            password: SUPABASE_PASSWORD!
        })
    }

    async getMangas(): Promise<Manga[] | null> {
        const { data, error } = await this.client
            .from('mangas')
            .select('*')

        if (error) console.error(error)
        return data?.map((e) => convertAnytoManga(e)) || null;
    }

    async getMangaByName(name: string): Promise<Manga[] | null> {
        const { data, error } = await this.client
            .from('mangas')
            .select('*')
            .match({ name_manga: name })

        if (error || data.length === 0) console.error(error)
        //console.log(data)
        // data?.forEach((e) => {
        //     e.img = this.client.storage.from('mangas').createSignedUrl(e.img, 60 * 60 * 24)
        // })
        //console.log(data)
        return data?.map((e) => convertAnytoManga(e)) || null;
    }

    async getMangaById(id: number): Promise<Manga[] | null> {
        const { data, error } = await this.client
            .from('mangas')
            .select('*')
            .match({ id_manga: id })
        return data?.map((e) => convertAnytoManga(e)) || null;
    }

    async getAlertsByUserId(id: string) : Promise<Manga[] | null> {
        const res = await this.client
            .from('alerte')
            .select('id_manga')
            .match({ id_user: id })

        if (res.data?.length == 0) return null;
        const { data, error } = await this.client
            .from('mangas')
            .select('*')

        let mangas = data?.filter((e) => {
            return res.data?.find((f) => {
                return f.id_manga == e.id_manga
            })
        })

        // console.log(mangas)
        return mangas?.map((e) => convertAnytoManga(e)) || null;
    }

    async supprimerManga(name: string) {
        const { data, error } = await this.client
            .from('mangas')
            .delete()
            .match({ name_manga: name })
        return data
    }

    async addManga(name: string, chap: number, page: boolean, image: string, synopsis: string) {
        const { data, error } = await this.client
            .from('mangas')
            .insert([
                { name_manga: name, chapitre_manga: chap, page: page, img: image, synopsis: synopsis }
            ])
        return data
    }

    async updateChapter(id_manga: number, chap: number) {
        const { data, error } = await this.client
            .from('mangas')
            .update({ chapitre_manga: chap })
            .match({ id_manga: id_manga })
        return data
    }

    async addUser(id: string, name: string, img: string) {
        const { data, error } = await this.client
            .from('users')
            .insert([
                { id_user: id, name_user: name, pp: img }
            ])
        return data
    }

    async getUsers() {
        const { data, error } = await this.client
            .from('users')
            .select('*')
        return data
    }

    async getUser(id_user: string) {
        const { data, error } = await this.client
            .from('users')
            .select('*')
            .match({ id_user: id_user })
        return data
    }

    async getUserByName(name_user: string) {
        const { data, error } = await this.client
            .from('users')
            .select('*')
            .match({ name_user: name_user })
        return data
    }

    async supprimerUser(id: string) {
        const { data, error } = await this.client
            .from('users')
            .delete()
            .match({ id_user: id })
        return data
    }

    async addMangaAlert(id_manga: number, id_user: string) {
        const { data, error } = await this.client
            .from('alerte')
            .insert([
                { id_manga: id_manga, id_user: id_user }
            ])
        return { data, error }

    }

    async getAlertsByWorkId(id_manga: number) {
        const { data, error } = await this.client
            .from('alerte')
            .select('id_user')
            .match({ id_manga: id_manga })
        return data
    }

    async verifyAlert(id_user: string, id_manga: number) {
        const { data, error } = await this.client
            .from('alerte')
            .select('*')
            .match({ id_user: id_user, id_manga: id_manga })
        return data
    }

    async deleteAlert(id_manga: number, id_user: string) {
        const { data, error } = await this.client
            .from('alerte')
            .delete()
            .match({ id_manga: id_manga, id_user: id_user })
        return data
    }

    async addToken(id_user: string): Promise<string> {
        const random = randomString()

        //console.log(random, id_user)

        const { data, error } = await this.client
            .from('token')
            .insert([
                { user_id: id_user, token: random }
            ])

        //if(error) console.error(error)

        return random;
    }

    async getImgFromTest(name: string) {
        const { data } = this.client
            .storage
            .from('test')
            .getPublicUrl(name + '.png')
        // .createSignedUrl(name + '.png', 60 * 60 * 24, { download: false })


        // if(error) console.error(error)
        return data
    }

    async getImgFromTestDnw(name: string) {
        const { data, error } = await this.client
            .storage
            .from('test')
            .download(name + '.png')

        if (error) console.error(error)
        return data
    }

    async addImgToTest(name: string, img: ArrayBuffer) {
        const { data, error } = await this.client
            .storage
            .from('test')
            .upload(name, img, { contentType: 'image/png' })

        if (error) console.error(error)
        return data
    }

    async supImgFromTest(name: string) {
        const { data, error } = await this.client
            .storage
            .from('test')
            .remove([name + '.png'])

        if (error) console.error(error)
        return data
    }


}

export const BDD = Supabase.instance
