import { createClient, SupabaseClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
class supabase{
    url:string
    key:string

    client:SupabaseClient;

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

    async supprimerManga(name:string){
        const { data, error } = await this.client
        .from('mangas')
        .delete()
        .match({ name_manga: name })
        return data
    }

    async ajouterManga(name:string, chap:number){
        const { data, error } = await this.client
        .from('mangas')
        .insert([
            { name_manga: name, chapitre_manga: chap }
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

    async addUsers(id:string, name:string){
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

    async supprimerUser(id:string){
        const { data, error } = await this.client
        .from('users')
        .delete()
        .match({ id_user: id })
        return data
    }

    async addLien(id_manga:number, id_user:number){
        const { data, error } = await this.client
        .from('lien')
        .insert([
            { id_manga: id_manga, id_user: id_user }
        ])
        return data
    }

    async getLien(id_manga:number){
        const { data, error } = await this.client
        .from('lien')
        .select('id_user')
        .match({ id_manga: id_manga })
        return data
    }

    async supprimerLien(id_manga:number, id_user:number){
        const { data, error } = await this.client
        .from('lien')
        .delete()
        .match({ id_manga: id_manga, id_user: id_user })
        return data
    }


}

export const BDD = new supabase()


// BDD.getManga("").then((manga) => {
//     console.log(manga);
// })