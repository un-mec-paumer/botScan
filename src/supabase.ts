import { createClient, SupabaseClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { randomInt } from 'crypto'
import { add } from 'cheerio/lib/api/traversing';

function randomString() {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    let random:number;
    for ( let i = 0; i < 32; i++ ) {
        random = randomInt(0, charactersLength)
        result += characters.charAt(random);
    }
    return result;
}

class supabase{
    private url:string
    private key:string

    private client:SupabaseClient;

    constructor(){
        dotenv.config()
        this.url = process.env.SUPABASE_URL!
        this.key = process.env.SUPABASE_KEY!

        //console.log(this.url, this.key)
        this.client = createClient(this.url, this.key)
    }

    async getMangas(){
        const { data, error } = await this.client
        .from('mangas')
        .select('*')
        return data
    }

    async getManga(name:string){
        const { data, error } = await this.client
        .from('mangas')
        .select('*')
        .match({ name_manga: name })
        return data
    }

    async getMangaById(id:number){
        const { data, error } = await this.client
        .from('mangas')
        .select('*')
        .match({ id_manga: id })
        return data
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

    async addUser(id:string, name:string){
        const { data, error } = await this.client
        .from('users')
        .insert([
            { id_user: id, name_user: name }
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
        const { data, error } = await this.client
        .from('token')
        .insert([
            { user_id: id_user, token: random }
        ])

        return random;
    }

    async getMangasByToken(token:string){
        const { data, error } = await this.client
        .rpc('get_mangas_with_token', { token_string: token })
        return data
    }
}

export const BDD = new supabase()

// console.log(randomString())
// BDD.addToken("452370867758956554").then((data) => {
//     console.log(data)
//     BDD.getMangaByToken(data).then((data2) => {
//         console.log(data2)
//     })
// })

// BDD.supprimerLien(3, "452370867758956554").then((error) => {
//     BDD.getLien(3).then((data) => {
//         console.log(data)
//     }).then(() => {
//         BDD.getLiens().then((data) => {
//             console.log(data)
//         });
//     });

//     console.log(error)
// })