import { createClient, SupabaseClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { randomInt } from 'crypto'


export function randomString() {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    let random: number;
    for ( let i = 0; i < 32; i++ ) {
        random = randomInt(0, charactersLength)
        result += characters.charAt(random);
    }
    return result;
}

class supabase{
    private url!: string;
    private key!: string;

    private client!: SupabaseClient;

    public static instance:supabase;

    constructor(){
        if (supabase.instance !== undefined || supabase.instance !== null ) {
            return supabase.instance;
        } else {
            supabase.instance = this;

            dotenv.config()
            this.url = process.env.SUPABASE_URL!
            this.key = process.env.SUPABASE_KEY!

            //console.log(this.url, this.key)
            this.client = createClient(this.url, this.key)

            this.client.auth.signInWithPassword({
                email: process.env.SUPABASE_EMAIL!,
                password: process.env.SUPABASE_PASSWORD!
            })
            return this;
        }
    }

    async getMangas(){
        const { data, error } = await this.client
        .from('mangas')
        .select('*')

        if(error) console.error(error)
        return data
    }

    async getManga(name:string){
        const { data, error } = await this.client
        .from('mangas')
        .select('*')
        .match({ name_manga: name })

        if(error || data.length === 0) console.error(error)
        //console.log(data)
        // data?.forEach((e) => {
        //     e.img = this.client.storage.from('mangas').createSignedUrl(e.img, 60 * 60 * 24)
        // })
        //console.log(data)
        return data
    }

    async getMangaById(id:number){
        const { data, error } = await this.client
        .from('mangas')
        .select('*')
        .match({ id_manga: id })
        return data
    }

    async getMangaBylien(id:string){
        const res = await this.client
        .from('alerte')
        .select('id_manga')
        .match({ id_user: id })

        if(res.data?.length == 0) return;
        const { data, error } = await this.client
        .from('mangas')
        .select('*')

        let mangas = data?.filter((e) => {
            return res.data?.find((f) => {
                return f.id_manga == e.id_manga
            })
        })

        // console.log(mangas)
        return mangas
    }

    async supprimerManga(name:string){
        const { data, error } = await this.client
        .from('mangas')
        .delete()
        .match({ name_manga: name })
        return data
    }

    async addManga(name:string, chap:number, page:boolean, image:string, synopsis:string){
        const { data, error } = await this.client
        .from('mangas')
        .insert([
            { name_manga: name, chapitre_manga: chap, page: page, img: image, synopsis: synopsis }
        ])
        return data
    }

    async getChapitre(name:string){
        const { data, error } = await this.client
        .from('mangas')
        .select('chapitre_manga')
        .match({ name_manga: name })
        return data
    }

    async updateChapitre(name:string, chap:number){
        const { data, error } = await this.client
        .from('mangas')
        .update({ chapitre_manga: chap })
        .match({ name_manga: name })
        return data
    }

    async addUser(id:string, name:string, img:string){
        const { data, error } = await this.client
        .from('users')
        .insert([
            { id_user: id, name_user: name, pp: img }
        ])
        return data
    }

    async getUsers(){
        const { data, error } = await this.client
        .from('users')
        .select('*')
        return data
    }

    async getUser(id_user:string){
        const { data, error } = await this.client
        .from('users')
        .select('*')
        .match({ id_user: id_user })
        return data
    }

    async getUserByName(name_user:string){
        const { data, error } = await this.client
        .from('users')
        .select('*')
        .match({ name_user: name_user })
        return data
    }

    async supprimerUser(id:string){
        const { data, error } = await this.client
        .from('users')
        .delete()
        .match({ id_user: id })
        return data
    }

    async addLien(id_manga:number, id_user:string){
        const { data, error } = await this.client
        .from('alerte')
        .insert([
            { id_manga: id_manga, id_user: id_user}
        ])
        return {data, error}

    }

    async getLien(id_manga:number){
        const { data, error } = await this.client
        .from('alerte')
        .select('id_user')
        .match({ id_manga: id_manga })
        return data
    }

    async verfiLien(id_user:string, id_manga:number){
        const { data, error } = await this.client
        .from('alerte')
        .select('*')
        .match({ id_user: id_user, id_manga: id_manga })
        return data
    }

    async getLiens(){
        const { data, error } = await this.client
        .from('alerte')
        .select('*')
        return data
    }

    async supprimerLien(id_manga:number, id_user:string){
        const { data, error } = await this.client
        .from('alerte')
        .delete()
        .match({ id_manga: id_manga, id_user: id_user })
        return data
    }

    async addToken(id_user:string):Promise<string>{
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

    async getUserByToken(token:string){
        const { data, error } = await this.client
        .from('token')
        .select('user_id')
        .match({ token: token })
        return data
    }
    async getMangasByToken(token:string){
        const { data, error } = await this.client
        .rpc('get_mangas_with_token', { token_string: token })
        return data
    }

    async addAlerteByToken(id_manga:number, token:string){
        this.getUserByToken(token).then((data) => {
            //console.log(data)
            if(data?.length == 0) return false;
            this.addLien(id_manga, data![0].user_id)
        })
    }

    async suppAlerteByToken(id_manga:number, token:string){
        this.getUserByToken(token).then((data) => {
            //console.log(data)
            if(data?.length == 0) return false;
            this.supprimerLien(id_manga, data![0].user_id)
        })
    }

    async getAlerteByToken(token:string, id_manga:number){
        const user = await this.getUserByToken(token);

        if(user?.length == 0) return;
        const { data, error } = await this.client
        .from('alerte')
        .select('*')
        .match({ id_user: user![0].user_id, id_manga: id_manga })
        if(error) console.error(error)
        return data
    }

    async verifTokens(){
        
        let { data, error } = await this.client
        .rpc('delete_old_tokens')
        if (error) console.error(error)
        //else console.log(data)
        return data
    }

    async getUserInfo(token:string){
        const res = await this.getUserByToken(token);

        if(res?.length == 0) return;
        const { data, error } = await this.client
        .from('users')
        .select('*')
        .match({ id_user: res![0].user_id })

        if(error) console.error(error)
        return data
    }

    async getImgFromTest(name:string){
        const { data } = this.client
        .storage
        .from('test')
        .getPublicUrl(name + '.png')
        // .createSignedUrl(name + '.png', 60 * 60 * 24, { download: false })
        

        // if(error) console.error(error)
        return data
    }

    async getImgFromTestDnw(name:string){
        const { data, error } = await this.client
        .storage
        .from('test')
        .download(name + '.png')

        if(error) console.error(error)
        return data
    }

    async addImgToTest(name:string, img:ArrayBuffer){
        const { data, error } = await this.client
        .storage
        .from('test')
        .upload(name, img, {contentType: 'image/png'})

        if(error) console.error(error)
        return data
    }

    async supImgFromTest(name:string){
        const { data, error } = await this.client
        .storage
        .from('test')
        .remove([name + '.png'])

        if(error) console.error(error)
        return data
    }


}

export const BDD = new supabase()
