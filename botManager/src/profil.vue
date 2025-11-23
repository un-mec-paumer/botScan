<script setup lang="ts">
    import { api } from './Api';
    import { ref } from 'vue';
    import barreTache from './components/barreTache.vue';

    function isConnected(){
        const token = document.cookie.split(';').find((cookie) => cookie.includes('token'));
        //console.log(token);
        if(token){
            return true;
        }
        return false;
    }

    const connected = isConnected();

    function logout(){
        //document.cookie = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        //const cookie = document.cookie.split(';');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        console.log(document.cookie);
        window.location.href = "/";
    }

    // console.log(user);
    const user = ref({
        name_user: "",
        id_user: "",
        pp: ""
    })
async function getUser(){
    user.value = await fetch(api + "/getUser",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: document.cookie.split(';').find((cookie) => cookie.includes('token'))?.split('=')[1]
        })
    }).then((res) => res.json()).then((res) => {return res});
}

getUser();
    // console.log(user);
</script>

<template>
    <barreTache :is-connected="connected"/>

    <div v-if="connected" class="containerMax">
        <img v-bind:src="user.pp" alt="">
        <label for="nom">pseudo:</label>
        <h1 id="nom">{{ user.name_user }}</h1>
        <label for="id">id:</label>
        <h2 id="id">{{ user.id_user }}</h2>
        <button @click="logout">logout</button>
    </div>

    <!-- <img src="" alt="pp"> -->
</template>

<style scoped>

    .containerMax {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 55 vh;
        text-align: center;

        border: 2px solid #000;
        border-radius: 25px;

        margin-top: 7%;
        margin-left: 35%;
        margin-right: 35%;
    }
    .containerMax img{
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin: 20px;
    }

    button {
        /* margin: 0.5rem; */
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        /* width: 100%; */
        margin-top: 15px;
        margin-bottom: 15px;
        font-family: Bruno Ace;
    }

    button:hover {
        background-color: #ccc;
    }


</style>