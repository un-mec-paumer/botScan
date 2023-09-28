import express, { Request, Response } from 'express';
import { finder } from './chercheur';
import { writeFileSync } from 'fs';
import mangas from './mangas.json';

const app = express();

//console.log(mangas)

function findManga(){
    // console.log(mangas)

    mangas.forEach(manga => {
        finder(manga.name, manga.chapitre, manga.pages).then((value) => {
            //console.log(manga.name + " " + manga.chapitre + " " + value);
            if(value){
                console.log("Le chapitre " + manga.chapitre + " de " + manga.name + " est sorti !");
                manga.chapitre ++;

            }
        });
    });
    // console.log(JSON.stringify(mangas, null, 2))
    writeFileSync('./mangas.json', JSON.stringify(mangas, null, 2), 'utf-8');
    // console.log(mangas)
}

const idFinder = setInterval(findManga, 10000)


//findManga();


app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!');
});

app.listen(8085, () => {
    //console.log('Server running on port 3000');
    //console.info('Press Ctrl+C to quit');
});


