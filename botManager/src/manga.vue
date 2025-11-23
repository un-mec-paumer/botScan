<script setup lang="ts">
    import barreTache from './components/barreTache.vue';
    import sectionManga from './components/sectionManga.vue';
    import { api } from './Api';
    import { ref, onMounted } from 'vue';
    const isConnected = document.cookie.split(';').find((cookie) => cookie.includes('token')) ? true : false;
    const id = ref(location.href.split('=')[1]);
    const data = ref();
    fetch(api + "/mangaByid", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id.value
        })
    }).then((res) => res.json()).then((res) => {
        data.value = res[0];
    });
        

</script>


<template>
    <barreTache :is-connected="isConnected" />
    <div class="containerMax">
        <!-- <h1>Page manga</h1> -->
        <sectionManga v-if="data" :manga="data" :is-connected="isConnected" />
    </div>
</template>

<style scoped>
    .containerMax{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .containermanga {
        display: flex;
        flex-direction: column;
        width: 500px;
        height: 600px;
        background-color: #d9d9d9;
        border-radius: 10px;
        margin: 10px;
    }
</style>