import express, { Request, Response } from 'express';
import { finder } from './chercheur';
import mangas from './mangas.json';

const app = express();

console.log(mangas)

function findManga(){
    mangas.forEach(manga => {
        finder(manga.name, manga.chapitre, manga.pages).then((value) => {
            //console.log(manga.name + " " + manga.chapitre + " " + value);
            if(value){
                //console.log("Le chapitre " + manga.chapitre + " de " + manga.name + " est sorti !");
                manga.chapitre += 1;
            }
        });
    });
}

const idFinder = setInterval(findManga, 10000)


//findManga();


app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!');
});

app.listen(8085, () => {
    //console.log('Server running on port 3000');
    console.info('Press Ctrl+C to quit');
});


