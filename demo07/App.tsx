import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet} from 'react-native';
import { Appbar, Button, Text, Dialog, Portal, Provider, TextInput, List } from 'react-native-paper';
import * as SQLite from 'expo-sqlite'; // siinäpä se tuodaan
import { useEffect, useState } from 'react';

interface Ostos {
  id : number;
  tuote : string;
}

interface DialogiData {
  auki : boolean;
  teksti : string;
}

const db : SQLite.WebSQLDatabase = SQLite.openDatabase("ostoslista.db"); // avaa uusi tietokanta, parametri on tiedostonimi
                                                                        // jos ei ole, niin tämä luo
// tietokannan alustaminen, kysely eli transaction.
// vähintään kaksi nuolifunctiota, ekassa transactio ja toisessa virheenkäsittely, jos laitat kolmannen, niin siinä jotain mitä tekee, kun on onnistunut.
// eli niitä laitetaa 2-3
db.transaction(
  (tx : SQLite.SQLTransaction) => {
    //tx.executeSql(`DROP TABLE ostokset`); // Poista tämän rivin kommentti, jos haluat määrittää taulun uudestaan (poistaa myös sisällöt)
    tx.executeSql(`CREATE TABLE IF NOT EXISTS ostokset (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tuote TEXT
                  )`);
  }, 
  (err : SQLite.SQLError) => { // virheen käsittely
    console.log(err) 
  }
);

const App : React.FC = () : React.ReactElement => {

  const [dialogi, setDialogi] = useState<DialogiData>({auki:false, teksti: ""});
  const [ostokset, setOstokset] = useState<Ostos[]>([]);

  const tyhjennaOstoslista = () : void => {

    db.transaction(
      (tx : SQLite.SQLTransaction) => {
        tx.executeSql(`DELETE FROM ostokset`, [], 
          (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
            haeOstokset();
          });
      }, 
      (err: SQLite.SQLError) => console.log(err));

  }

  const lisaaOstos = () : void => {

    db.transaction(
      (tx : SQLite.SQLTransaction) => {
        tx.executeSql(`INSERT INTO ostokset (tuote) VALUES (?)`, [dialogi.teksti], // tässä oli ideana, että vältellään injektiota
          (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
            haeOstokset(); // varmistetaan, että tilamuuttuja db syncissä
          });
      }, 
      (err: SQLite.SQLError) => console.log(err));

    setDialogi({...dialogi, auki : false, teksti : ""}) // sitten vielä kiinni

  }

  const haeOstokset = () : void => {

    db.transaction(
      (tx : SQLite.SQLTransaction) => {
        tx.executeSql(`SELECT * FROM ostokset`, [], // toinen parametri, mahdolliset kyselyparametrit, arrayna, kolmas käsittely tuloksille
          (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => { // alaviivalla voi erottaa, toinen parametri on tulokset "rs"
            setOstokset(rs.rows._array); // rs:ssä on ne tulokset
          });
      }, 
      (err: SQLite.SQLError) => console.log(err));

  }

  useEffect(() => {

    haeOstokset();

  }, []);

  return (
    <Provider> // määrittää käyttöliittymän alueen
      <Appbar.Header>
        <Appbar.Content title="Demo7: SQLite"/>
      </Appbar.Header>
      <ScrollView style={{padding : 20}}>

        <Text variant='headlineSmall'>Ostoslista</Text>

        {(ostokset.length > 0) 
        ? ostokset.map((ostos: Ostos, idx: number) => {
            return (<List.Item 
              title={ostos.tuote}
              key={idx}
            />)
        })
        : <Text>Ei ostoksia</Text>
        }

        <Button
          style={{ marginTop : 20 }}
          mode="contained"
          icon="plus"
          onPress={() => setDialogi({...dialogi, auki : true})}
        >Lisää uusi ostos</Button>

        <Button
          style={{ marginTop : 20 }}
          buttonColor="red" // siinä hyvä keino laittaa väriä nabbulaan
          mode="contained"
          icon="delete"
          onPress={tyhjennaOstoslista}
        >Tyhjennä lista</Button>

        <Portal> // huolehtii, että tämä menee kaikkien elementtien pääälle
          <Dialog
            visible={dialogi.auki} // näytetäänkö vai ei, true tai false
            onDismiss={() => setDialogi({...dialogi, auki : false})}
          >
            <Dialog.Title>Lisää uusi ostos</Dialog.Title>
            <Dialog.Content>
              <TextInput 
                label="Ostos"
                mode="outlined"
                placeholder='Kirjoita ostos...'
                onChangeText={ (uusiTeksti : string) => setDialogi({...dialogi, teksti: uusiTeksti})}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={lisaaOstos}>Lisää listaan</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <StatusBar style="auto" />
      </ScrollView>
    </Provider>
  );
}

export default App;

/*
npx expo install expo-file-system expo-asset

*/