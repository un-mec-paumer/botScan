<script setup lang="ts">
    import { api } from '../Api';
    import { ref } from 'vue';
    const props = defineProps<{ isConnected:boolean }>()

    //console.log(test.isConnected);


    let user:any;
    const pp = ref("");

    function isconnected(){
        const token = document.cookie.split(';').find((cookie) => cookie.includes('token'));
        // console.log(token);
        if(token){
            return true;
        }
        return false;
    }

    //console.log(isConnected());

    if(isconnected()){
        user = fetch(api + "/getUser",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: document.cookie.split(';').find((cookie) => cookie.includes('token'))?.split('=')[1]
            })
        }).then((res) => res.json()).then((res) => {
            console.log(res);
            pp.value = res.pp;

            if(res.result == "notExist"){
                console.log("notExist");
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "../../signIn.html";
            }   
            return res;
        });

        
        // console.log(user);
        
    }
</script>

<template>
    <div class="container" v-if="!isConnected">
        <div class="left">
            <a href="../../index.html"><img src="../img/yuji.jpg" alt="logo"></a>
        </div>
        
        <div class="right">
            <a href="https://fr-scan.com">scan site</a>
            <!-- <a href="https://fr-scan.com">add a discord account</a> -->
            <a href="../../signIn.html">sign in</a>
        </div>
    </div>

    <div class="container" v-else>
        <div class="left">
            <a href="../../index.html"><img src="../img/yuji.jpg" alt="logo"></a>
            <a href="../../contact.html">contact me</a>
        </div>
        
        <div class="right">
            <a href="https://fr-scan.com">scan site</a>
            <a href="../../addmanga.html"> add a manga</a>
            <a href="../../profil.html">my account</a>
            <img v-bind:src="pp" alt="">
        </div>
    </div>

</template>

<style scoped>
    
    template{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100px;

    }

    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #000080;
        width: 100%;
        height: 125px;

    }

    div{
        background-color: #000080;
        align-items: center;
    }

    img {
        width: 65px;
        aspect-ratio: 1/1;
        /* border-radius: 50%; */
    }
    

    a {
        text-decoration: none;
        color: white;
        font-size: 25px;
        margin-left: 25px;
        margin-right: 25px;
    }

    a:hover {
        color: #646cff;
    }

    .left {
        display: flex;
        margin-left: 30px;
    }

    .right{
        display: flex;
        margin-right: 30px;
        /* align-content: center; */
    }

    .right img{
        width: 65px;
        height: 65;
        border-radius: 50%;
        margin-left: 25px;
    }

</style>
