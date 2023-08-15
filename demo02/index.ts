import express from 'express';
import { PrismaClient } from '@prisma/client';

const app : express.Application = express();

const prisma : PrismaClient = new PrismaClient();

const portti : number = Number(process.env.PORT) || 3002;

app.set("view engine", "ejs");

app.use(express.json()); // kun tulee req.bodystä, niin otettaan tämä käyttöön. mutta html lomakkeessa ei riitä yksin
app.use(express.urlencoded({extended : true})); // eli tämä vielä siihen lisäksi, niin osaa käsitellä html lomakkeita.

app.post("/poista", async (req : express.Request, res : express.Response) => {

    await prisma.ostos.delete({
        where : {
            id : Number(req.body.id)
        }
    });

    // voi myös ohjata uudelleen, sen sijaan, että res.send taas
    // tämä on suositeltavampi, kuin uudelleen res.render("index", ....)
    // koska, ei sitten tule esim. "haluatko lähettää lomakkeen uudelleen".
    // myös res.renderissä etunsa, jos pitää lähettää vaikka jotain filteröityjä tms.
    res.redirect("/");

});


app.post("/", async (req : express.Request, res : express.Response) => {

/*
näin voi vaikka testata
res.send("lisätään");
*/

    await prisma.ostos.create({
        data : {
            tuote : req.body.tuote || "Nimetön tuote",
            poimittu : false
        }
    });

    let ostokset = await prisma.ostos.findMany();

    // tässä vielä lähetetään selaimelle uudelleen se etusivu, voi kopioida
    // vaikka sieltä ihan juuren getistä.
    res.render("index", { ostokset : ostokset });

});

// tähän tulee se linkki
app.get("/poimittu", async (req : express.Request, res : express.Response) => {

    // res.send(req.query), niin voi testata;
    await prisma.ostos.update({
        where : {
            id : Number(req.query.id)
        },
        data : { // koska tulee stringinä, niin pitää muuttaa booleaniksi, esim. näin
            poimittu : (req.query.poimittu === "true" ) ? false : true
        }
    });

    res.redirect("/");

});


app.get("/", async (req : express.Request, res : express.Response) => {

    let ostokset = await prisma.ostos.findMany();

    res.render("index", { ostokset : ostokset });

});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen http://localhost:${portti}`);    

});