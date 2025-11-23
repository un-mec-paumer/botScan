<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Mangatype } from '../mangatype';
import { api } from '../Api';


const { manga, isConnected } = defineProps<{ manga: Mangatype, isConnected: boolean}>();
const sub = ref({ sub: false });
const loca = !location.href.includes("manga.html");
const lien = ref(loca ? "../../manga.html?id=" + manga.id_manga :"https://fr-scan.com/manga/" + manga.name_manga + "/");
const img = ref("");
const Token = document.cookie.split(';').find((cookie) => cookie.includes('token'))?.split('=')[1] ?? "";

onMounted(async () => {
  // Fetch manga image
  const imgResponse = await fetch(api + "/mangaImg", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: manga.name_manga
    })
  });
  const imgData = await imgResponse.json();
  img.value = imgData.signedUrl;

  // Fetch subscription data if connected
  if (isConnected) {
    const subResponse = await fetch(api + "/getSub", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_manga: manga.id_manga,
        token: Token
      })
    });
    sub.value = await subResponse.json();
  }
});

async function addSub() {
  console.log("add sub");
  const res = await fetch(api + "/addSub", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id_manga: manga.id_manga,
      token: Token
    })
  });
  console.log(res);
  sub.value.sub = !!res;
}

async function removeSub() {
  console.log("remove sub");
  const res = await fetch(api + "/deleteSub", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id_manga: manga.id_manga,
      token: Token
    })
  });
  console.log(res);
  sub.value.sub = !res;
}
</script>




<template>
    <div class="containermanga">
        <img id="img" v-bind:src="img" alt="manga">
        <h2>{{ manga.name_manga.replaceAll("-"," ") }}</h2>
        <label for="chap">chapitre:</label>
        <h3 id="chap">{{ manga.chapitre_manga }}</h3>
        <p> {{ manga.synopsis }}</p>
        <a :href="lien" >{{ loca ? 'read more' : 'link to manga scan' }}</a>

        <button v-if="isConnected && !sub.sub" @click="addSub">add subscride</button>
        <button v-else-if="isConnected && sub.sub" @click="removeSub">remove subscride</button>
    </div>
</template>

<style scoped>
    .containermanga{
      display: flex;
      flex-direction: column;
      width: auto;
      height: 575px;
      background-color: #d9d9d9;
      border-radius: 10px;
      margin-top: 50px;
      margin-bottom: 0px;
      margin-left: 25px;
      margin-right: 25px;
      align-items: center;
      justify-content: space-evenly;
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

    img{
        margin-top: 25px;
        width: auto;
        height: 186px;
    }

    h2{
        font-size: 25px;
        text-align: center;
        max-height: 40px;
    }

    h3{
        font-size: 20px;
        text-align: center;
        max-height: 20.4px;
        margin: 0%;
    }

    p{
        text-align: justify;
        padding-left: 25px;
        padding-right: 25px;

        max-height: 134.4px;

        overflow:auto;
    }

</style>