<script setup lang="ts">
    import { api } from '../Api';
    import { ref } from 'vue';

    const idDiscord = ref(''); 
    const connexion = ref(false);
    const token = ref('');
    async function signUp(){
        
        token.value = await fetch(api + '/newUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: idDiscord.value
            })
        }).then((res) => res.json()).then((res) => {return res.result});
        //console.log(token);

        if(token.value === "not Accept" || token.value === "notAccess to DM" || token.value === "ID not exist in discord"){
            //console.log(token);
            connexion.value = true;
            return;
        }

        document.cookie = 'token=' + token.value + '; expires=""; path=/'
        window.location.href = "/";
    }

</script>

<template>
    <form class="container" @submit.prevent="signUp">
        <h1>Sign Up</h1>
        <label for="idDiscord"> your discord id</label>
        <input id="idDiscord" type="text" placeholder="exe: 452370867758956554" v-model="idDiscord"/>
        <span v-if="connexion">error: {{ token }}</span>
        <button id="submit">Sign Up</button>
    </form>
</template>

<style scoped>
.container {
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


span {
    color: red;
}
</style>