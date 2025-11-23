<script setup lang="ts">
    import barreTache from './components/barreTache.vue';
    import { api } from './Api';
    import { ref } from 'vue';
    const isConnected = document.cookie.split(';').find((cookie) => cookie.includes('token')) ? true : false;
    const token = document.cookie.split(';').find((cookie) => cookie.includes('token'))?.split('=')[1] || ''
    const name_manga = ref('');
    const chapter = ref();
    const isPage = ref(false);
    
    const res = ref({res:false, result:''});

    async function addManga() {
        console.log(name_manga.value, chapter.value, isPage.value);
        res.value = await fetch(api + '/addManga', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name_manga.value,
                chapter: chapter.value,
                page: isPage.value,
                token: token

            })
        }).then((res) => res.json()).then((res) => {return {res:res.res, result:res.text}}) as {res:boolean, result:string};
        console.log("res.value:", res.value);
    }

</script>

<template>
    <barreTache :is-connected="isConnected" />

    
    <form class="containerMax" @submit.prevent="addManga">
        <label for="name_manga">name manga:</label>
        <input type="text" id="name_manga" placeholder="name" v-model="name_manga">
        <label for="chapter">last chapter:</label>
        <input type="number" id="chapter" placeholder="chapter" v-model="chapter">
        <label for="isPage">the manga have page:</label>
        <select id="isPage" v-model="isPage">
            <option value="false">no</option>
            <option value="true">yes</option>
        </select>
        <button type="submit" id="button">add manga</button>
        <span v-if="res.res" style="color: black;">{{ res.result }}</span>
        <span v-else  style="color: red;">{{ res.result }}</span>
    </form>
    
</template>

<style scoped>
    .containerMax {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 50vh;
        text-align: center;

        border: 2px solid #000;
        border-radius: 25px;

        margin-top: 7%;
        margin-left: 40%;
        margin-right: 40%;
    }

    input {
        margin: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        /* width: 100%; */

        font-family: Bruno Ace;
    }

    button {
        /* margin: 0.5rem; */
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        /* width: 100%; */
        margin-top: 30px;
        font-family: Bruno Ace;
    }

    button:hover {
        background-color: #ccc;
    }

    /* span {
        color: red;
        font-size: 15px;
    } */

    select {
        margin: 0.5rem;
        margin-bottom: 0.5rem;
        padding: 0.3rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        /* width: 100%; */

        font-family: Bruno Ace;
    }

</style>