# Sovellusohjelmointi 3 -demot + omat muistiinpanoni

# demo 1
- EJS perusteet, tekee prismasta haettuna ostoslistan.
- Material design litestä tyylit.

# demo 2
- sama kuin edellinen, mutta tulee formit (ja linkit) myös mukaan.

# demo 3
- kuvagalleria demo. tiedostojen upload.
- tyylejä sisäisesti, includen käyttö

# demo 4
- react native


# muita noteja:

Material design lite: https://getmdl.io/
mdi iconit: https://fonts.google.com/icons?selected=Material+Icons:arrow_circle_up:

tuosta käyntiin:
npm init
npm install typescript @types/node ts-node nodemon --save-dev
npm install @types/express --save-dev
npm install express
 
  "scripts": {
    "start": "npx nodemon index.ts"
  },

EJS:
npm install ejs
npm @types/ejs --save-dev

// prisma asennus ja käyttö:
/**
 * npm install prisma --save-dev
 * sitten client
 * npm install @prisma/client
 * npx prisma init // eli kun se on package.jsonissa, niin sitä voi käyttää npx komennolla
 * sitten syntyi prisma kansio,
 * siellä on aluksi vain schema.prisma
 * lisäksi tuli juuren .env
 * asenna vs codessa prisma
 * 
 * prisman schemassa:
 * client, se ok
 * sitten vaihdetaan datasourcee, eli mitä käytetään tietolähteenä
 * tehdään tässä vaiheessa sql litellä, eli siitä slqlite, tuohon "provider" kohtaan
 * se urli, niin se tulee tuolta .env kohdasta, siellähän se DATABASEURL on
 * mutta vaihdetaan nyt tässä tehtävässä: "file:./data.db", mitä käytetään tietokantana tässä
 * tee modeli, eli esim sen mukaan mitä tässä esimerkin prismassa
 * 
 * Kun skema valmis, niin tee migraatio:
 * npx prisma migrate dev --name init // init vaan nimi, voi olla vaikka eka tms.
 * nyt tuli migrations kansio, jossa se "nimi" ja sitten migration.sql, jossa sama
 * asia sql:nä. Jonka voi käyttää vaikka dumbbina oikeaan tietokantaan.
 * data.db syntyi myös, joka tietokanta.
 * prisma studio:
 * npx prisma studio // joka aukasee local hostiin hallintatyökalun, jossa näkyy modeli esim.
 * ja siellä siihen voi syötellä ja hallita. click ostos, sitten vaikka dd record, niin jo
 * voit laitella kaikkee. jos teet migraten uudelleen, niin se sitten tekee uuden db:n
 * eli vanhat entryt häviää. tämä myös teki node_modulesiin prisma clientin. Eli jos 
 * muutat prisman schemaa, niin: npx prisma generate, niin tulee muutokset käyttöön.
 * 
 * Eli ikäänkuin oman modelsin tilalla käytetään tota prismaa.
 * Prisman dokumentointi: https://www.prisma.io/docs/
 * 
 
 */


