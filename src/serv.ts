import express, { Request, Response } from 'express';
import { finder } from './chercheur';
import { writeFile } from 'fs';
import mangas from './data/mangas.json';

const app = express();

//console.log(mangas)

function findManga(){
    //console.log(mangas)

    mangas.forEach(manga => {
        finder(manga.name, manga.chapitre, manga.pages).then((value) => {
            //console.log(manga.name + " " + manga.chapitre + " " + value);
            if(value){
                manga.chapitre ++;
                console.log("Le chapitre " + manga.chapitre + " de " + manga.name + " est sorti !");
                
                writeFile( __dirname + '/data/mangas.json', JSON.stringify(mangas, null, 2),(err) => {
                    if (err) {
                        console.error('Une erreur s\'est produite lors de l\'écriture du fichier :', err);
                    } else {
                        console.log('Le fichier a été écrit avec succès !');
                    }
                    //console.log("Le chapitre " + manga.chapitre + " de " + manga.name + " est enregistré !");
                });
            }
        });
    });
    // console.log(JSON.stringify(mangas, null, 2))
    // 
    console.log(mangas)
}

const idFinder = setInterval(findManga, 10000)


//findManga();


app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!');
});

app.get('/mangas', (req:Request, res:Response) => {
    res.send(mangas);
});

app.get('/mangas/:name', (req:Request, res:Response) => {
    const name = req.params.name;
    // console.log(name);
    const manga = mangas.find(manga => manga.name === name);
    // console.log(manga);
    res.send(manga);
});

app.listen(8085, () => {
    //console.log('Server running on port 3000');
    console.info('Press Ctrl+C to quit');
});


