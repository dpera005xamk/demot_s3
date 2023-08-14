import express from 'express';
import { PrismaClient } from '@prisma/client';

const app : express.Application = express();

const prisma : PrismaClient = new PrismaClient();

const portti : number = Number(process.env.PORT) || 3001;

// koska ejs on expressin laajennus, niin se otetaan tällä tavalla käyntiin
// view engine käyttöön ja sieltä ejs
// views kansiossa ejs templatet
app.set("view engine", "ejs");

app.get("/", async (req : express.Request, res : express.Response) => {

    let ostokset = await prisma.ostos.findMany();

    // ei kirjoteta päätettä, se tulee tuolta view enginestä
    // näin viedään ostokset muuttuja tuohon templateen
    res.render("index", { ostokset : ostokset }); // millä tunnetaa : mikä tässä
    // ilman muuttujaa olisi: res.render("index");
    // lisää muuttuja { ostokset : ostokset, myytävänä : myytävänä }
    // näin voi laittaa myös { ostokset }, niin laittaa nimeksi myös sen saman

});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen http://localhost:${portti}`);    

});

// CSS. esim. material design lite getmdl.io
// ota heidän sivuilta linkit, sieltä hostedista esim. getting started kohdasta
// roboto löytyy valikosta styles sieltä, link myös.
// sit alkaa jo tapahtua, esim. rupea h1-h4:t muokkaantumaan
// voit sitten esim. h1:iä ja muita pienennellä omalla <style> kentällä sen jälkeen.
// components kohdassa ja sieltä layout, niin siellä on gridejä sun muita
// eli etsit sieltä sopivia classeja.