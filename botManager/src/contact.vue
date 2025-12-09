<script setup lang="ts">
    import { api } from './Api';
    import barreTache from './components/barreTache.vue';
    import { ref } from 'vue';

    function isConnected(){
        const token = document.cookie.split(';').find((cookie) => cookie.includes('token'));
        //console.log(token);
        if(token){
            return true;
        }
        return false;
    }

    const text = ref("");
    const res = ref(false);
    const submit = ref(false);
    const isconnected = ref(isConnected());

    if(!isconnected){
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "./signIn.html";
    }

    async function sendMail(){
        submit.value = true;
        if(text.value == ""){
            return;
        }
        res.value = await fetch(api + "/sendMessage",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text.value,
                token : document.cookie.split(';').find((cookie) => cookie.includes('token'))?.split('=')[1]
            })
        }).then((res) => res.json()).then((res) => {return res});
    }
</script>


<template>
    <barreTache :is-connected="isconnected"/>

    <form class="containerMax" @submit.prevent="sendMail">
        <h1>contact the dev</h1>
        <textarea name="text" id="text" v-model="text"></textarea>
        <button type="submit">send</button>

        <span v-if="submit && res">message sent</span>
        <!-- <span v-if="submit && !res">probleme try again later</span> -->
        <span v-if="submit && text === ''"> put a message please</span>
    </form>

</template>


<style>
    .containerMax{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 50vh;
        text-align: center;

        border: 2px solid #000;
        border-radius: 25px;

        margin-top: 7%;
        margin-left: 35%;
        margin-right: 35%;
    }

    textarea{
        font-family: Bruno Ace;
        font-size: 1rem;

        width: 75%;
        height: 50%;
    }

    button {
    /* margin: 0.5rem; */
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    /* width: 100%; */
    margin-top: 30px;
    font-family: Bruno Ace;
    margin-bottom: 5%;
    }

    button:hover {
        background-color: #ccc;
    }



</style>