import axios from "axios";

export async function finder(manga: string, chapitre: number, page:boolean):Promise<boolean>{
    if(page){
        let test = await axios.get("https://fr-scan.cc/manga/" + manga + "/chapitre-" + chapitre + "-vf/p/1000/");
        chapitre ++;
        return test.data.includes('https://fr-scan.cc/manga/'+ manga +'/chapitre-' + chapitre +'-vf/p/1/');
    }
    else{
        let test = await axios.get("https://fr-scan.cc/manga/" + manga + "/chapitre-" + chapitre + "-vf/");
        chapitre ++;
        return test.data.includes('https://fr-scan.cc/manga/'+ manga +'/chapitre-' + chapitre +'-vf/');
    }
}

// finder("one-piece", 1093, true).then((value) => {
//     console.log(value);
// });
