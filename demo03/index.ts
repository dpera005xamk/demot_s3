import express from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import multer from "multer"; // kun käytetään multiform part form tapaa npm install npm install multer
                            // npm install --save-dev @types/multer
import fs from "fs/promises";

// Jatka: Video 20:38!

const app : express.Application = express();
const prisma : PrismaClient = new PrismaClient();

const uploadKasittelija : express.RequestHandler = multer({  // multerin ilmentymä
    dest : path.resolve(__dirname, "tmp"), // mihin menee
    limits : {
        fileSize : (1024 * 500)
    },
    fileFilter : (req, file, callback) => {

        if (["jpg", "jpeg"].includes(file.mimetype.split("/")[1])) {

            callback(null, true);

        } else {

            callback(new Error());

        }

        

    }
}).single("tiedosto");

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

app.post("/lisaa", async (req : express.Request, res : express.Response ) => {

    uploadKasittelija(req, res, async (err : any) => {

        if (err instanceof multer.MulterError) {
            res.render("lisaa", { "virhe" : "Tiedosto on tiedostokooltaan liian suuri (> 500kt).", "teksti" : req.body.teksti });
        } else if (err) {
            res.render("lisaa", { "virhe" : "Väärä tiedostomuoto. Käytä ainoastaan jpg-kuvia.", "teksti" : req.body.teksti });        
        } else {

            if (req.file) {

                let tiedostonimi : string = `${req.file.filename}.jpg`; 
        
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

    res.render("lisaa", {virhe : "", teksti : ""});

});

app.get("/", async (req : express.Request, res : express.Response ) => {

    res.render("index", {kuvat : await prisma.kuva.findMany()});

});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen : http://localhost:${portti}`);

});