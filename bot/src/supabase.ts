import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { randomInt } from 'crypto'

import { SUPABASE_EMAIL, SUPABASE_KEY, SUPABASE_PASSWORD, SUPABASE_URL } from './variables';


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
