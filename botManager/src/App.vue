<script setup lang="ts">
import { Mangatype } from './mangatype';
  import sectionManga from './components/sectionManga.vue';
  import barreTache from './components/barreTache.vue';
  import { api } from './Api';
  import { ref } from 'vue';
  // const connected = false;
  let token = "";
  function isConnected(){
    token = document.cookie.split(';').find((cookie) => cookie.includes('token')) || "";
    //console.log(token);
    if(token){
      return true;
    }
    return false;
  }

  const maxSection = ref([] as Array<Mangatype>) // [[manga, manga, manga], [manga, manga, manga]]
  // console.log(data);
  let compteur = 0;
  let first = true;
  const connected = isConnected();

  fetch(api + '/mangas').then((res) => res.json()).then((res) => {
    res.forEach((manga: Mangatype) => {
      maxSection.value.push(manga);
    })

    //maxSection.value.reverse();
  })
  //console.log("hello world");

  console.log(maxSection.value);
</script>

<template>
  <barreTache :is-connected="connected" />
  <div class="containerMax" >
    <sectionManga v-for="manga in maxSection" :manga="manga" :isConnected="connected"/>
  </div>
</template>

<style scoped>
.containerMax {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;

  width: 100%;
}

.containermanga{
  display: flex;
  flex-direction: column;
  width: 360px;
  height: 575px;
  background-color: #d9d9d9;
  border-radius: 10px;
  margin-top: 50px;
  margin-bottom: 0px;
  margin-left: 25px;
  margin-right: 25px;
  align-items: center;
}

</style>
./Manga