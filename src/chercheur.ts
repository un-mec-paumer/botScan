export async function finder(manga: string, chapitre: number, page: boolean): Promise<boolean> {
    let url: string;
    if (page) {
        url = "https://fr-scan.cc/manga/" + manga + "/chapitre-" + chapitre + "-vf/p/10000/";
    } else {
        url = "https://fr-scan.cc/manga/" + manga + "/chapitre-" + chapitre + "-vf/";
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
            },
        });

        chapitre++;
        const text = await response.text();
        // console.log(text);
        return text.includes('https://fr-scan.cc/manga/' + manga + '/chapitre-' + chapitre + '-vf/');
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}


finder("one-piece", 1093, true).then((value) => {
    console.log(value);
});
