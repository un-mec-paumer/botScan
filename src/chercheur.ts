import axios from "axios";

function specialFinder(reponse:string) {

}

async function finder(manga: string, chapitre: string):Promise<boolean>{
    let test = await axios.get("https://fr-scan.cc/" + manga + chapitre);

    return test.data.includes('https://fr-scan.cc/manga/ombres-et-lumieres/chapitre-221-vf/');
}

finder("manga/ombres-et-lumieres", "/chapitre-220-vf/").then((value) => {
    console.log(value);
});
