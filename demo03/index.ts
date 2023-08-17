import express from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import multer from "multer"; // kun käytetään multiform part form tapaa npm install npm install multer
                            // npm install --save-dev @types/multer
import fs from "fs/promises"; // file systemin promise versio, että toimii async

// Jatka: Video 20:38!

const app : express.Application = express();
const prisma : PrismaClient = new PrismaClient();

const uploadKasittelija : express.RequestHandler = multer({  // multerin ilmentymä
    dest : path.resolve(__dirname, "tmp"), // mihin menee, eli tmp kansioon, aina hyvä käyttää tempiä eka, ei suoraan tuotantoon
    limits : {
        fileSize : (1024 * 500) //500 kilotavua, eli tuo jälkimmäinen oikeastaan vastaa kilotavujen määrää
    },
    fileFilter : (req, file, callback) => { // callback: functio nimettynä, jota kutsutaan myöhemmin, yleensä näin nimetty callbackiksi
        // console.log(file.mimetype.split("/"[1])); pitäisi tulostaa esim. "png"
        if (["jpg", "jpeg"].includes(file.mimetype.split("/")[1])) { // tässä tiedoston tyypit, hyvä jo tässä vaiheessa, ennen tallennusta.
                                        // mime tyyppi on tuo mikä tyyppi, esim. image/png
                                        // pilkkoo / kohdasta, eli otetaan 1, koska se on solu 1, eli tulostuu vaan "png"
            callback(null, true); // true tarkottaa, että hyväksyy

        } else {

            callback(new Error());

        }

        

    }
}).single("tiedosto"); // yksi tiedosto

const portti : number = Number(process.env.PORT) || 3003;

app.set("view engine", "ejs");

// määritellään staattisten tiedostojen kansio
// sinne css, fonts ja img
// niihin kopioitu nuo tyylit ja fontit, eli ne on sitten paikallisesti siellä.
// npm install @fontsource/material-icons @fontsource/roboto
// ne menee sillä node_modulesiin, ja sinne voi viitata, mutta voit kopioida ne sieltä ja laittaa
// tonne fonts kansioon. sitten voi viitata "fonts/roboto/index.css" jne.
// css voit tehdä vaikka sit styles.css ja sinne sisällöksi, mitä olisi stylesissä
app.use(express.static(path.resolve(__dirname, "public")));

// näin taitaisi toimia myös:
//app.post("/lisaa", uploadKasittelija.single("tiedosto"), async......PrismaClient.
// tällein sen näkisi, eli siitä tulisi paljon tietoa:
// res.send(JSON.stringify(req.file));
app.post("/lisaa", async (req : express.Request, res : express.Response ) => {

    uploadKasittelija(req, res, async (err : any) => {

        if (err instanceof multer.MulterError) { // tämä triggeröityy, jos multerista tuleva erroria
                    // mihin ejs tiedostoon, eli "lisaa" tässä tapauksessa.                                   tällä se bodyn teksti viedään sinne
            res.render("lisaa", { "virhe" : "Tiedosto on tiedostokooltaan liian suuri (> 500kt).", "teksti" : req.body.teksti });
        } else if (err) { // joku muu error, kuin multer errori
            res.render("lisaa", { "virhe" : "Väärä tiedostomuoto. Käytä ainoastaan jpg-kuvia.", "teksti" : req.body.teksti });        
        } else {

            if (req.file) { // jos req.file on olemassa, niin tapahtuu seuraavaa

                let tiedostonimi : string = `${req.file.filename}.jpg`; 
        
                // kopioi tmp:stä tuonne publiciin, mistä ne näytetään.
                await fs.copyFile(path.resolve(__dirname, "tmp", String(req.file.filename)), path.resolve(__dirname, "public", "img", tiedostonimi))
        
                await prisma.kuva.create({
                    data : {
                        teksti : req.body.teksti || "Nimetön kuva",
                        tiedosto : tiedostonimi
                    }
                });
        
            }
        
            res.redirect("/");

        }

    });



});

app.get("/lisaa", async (req : express.Request, res : express.Response ) => {

    res.render("lisaa", {virhe : "", teksti : ""}); // pitää olla nämä virhe ja teksti, että voi käyttää niitä

});

app.get("/", async (req : express.Request, res : express.Response ) => {

    res.render("index", {kuvat : await prisma.kuva.findMany()});

});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen : http://localhost:${portti}`);

});