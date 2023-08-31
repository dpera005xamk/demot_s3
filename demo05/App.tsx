import { StatusBar } from 'expo-status-bar';
import { View, Vibration } from 'react-native';
import { Appbar, Button, List } from 'react-native-paper';
import * as Device from 'expo-device'; // yleiskomponentti laitteesta
import * as Battery from 'expo-battery'; // importtaa kaikki ja nimeä
import { useEffect, useState } from 'react';

const App : React.FC = () : React.ReactElement => {

  const [akkulataus, setAkkulataus] = useState<number>();
  const [latauksessa, setLatauksessa] = useState<string>();

  useEffect(() => {

    (async () : Promise<void> => { // näin voit käyttää asyncciä täällä useEffectiä, asyncit palauttaa Promisen
                                  // meinaa, että sulut, että lennosta tehdään async functio

      setAkkulataus(await Battery.getBatteryLevelAsync());

    })(); // nämä sulut täällä tarkoittaa, että se suoritetaan samantien.

    // näin käynnistetään tilaaja, eli Event, tuo ylempi on Method, eli metodi.
    const latausKuuntelija = Battery.addBatteryStateListener((e: Battery.BatteryStateEvent) => {

      if (e.batteryState === 2) {
        setLatauksessa("Kyllä");
      } else {
        setLatauksessa("Ei");
      }

    });

    return () => latausKuuntelija.remove();
    
  }, []); // tämähän oli se, että sovelluksen käynnistyessä

  return (
    <>
    <Appbar.Header>
      <Appbar.Content title="Demo 5: Laitekomponentit" />
    </Appbar.Header>
    <View style={{marginHorizontal: 10}}>

      <List.Accordion title="Perustietoja laitteesta"> /* accordion tyyli löytyy sieltä, tommonen vetovalikko tyyppinen */
        <List.Item title="Merkki" description={Device.brand}/>
        <List.Item title="Malli" description={Device.modelName}/>
        <List.Item title="Käyttöjärjestelmä" description={Device.osName} />
        <List.Item title="Versio" description={Device.osVersion} />
      </List.Accordion>

      <List.Accordion title="Akkutietoja">
        <List.Item title="Latauksen määrä" description={`${(100 * Number(akkulataus)).toFixed(2)} %`}/>
        <List.Item title="Latauksessa" description={latauksessa} />
      </List.Accordion>

      <Button 
        style={{marginVertical: 10}}
        mode="contained"
        onPress={() => Vibration.vibrate(2000)} // millisekunteja, eli 2s tuo.
      >Värinää!</Button>

      <StatusBar style="auto" /> /* voi jättää, kun vaikuttaa statusbarin ominaisuuksiin */
    </View>
    </>
  );
}

export default App;

/*
npm install react-native-paper asentaa r-n-p
käynnistä expo npx expo start, jos ei löydä, ni restartta expo sovellus.
- ei niin tarvita stylejä, kun tosta paperista tulee ihan hyvät.
- docs.expo.dev api reference kohdassa on mitä ne tarvii, esim. battery, device, camera
- npx expo install expo-device, eli ei siis npm
- react nativen, reactnative.dev/docs ja siellä esim Vibration, niin voi käyttää vaikka värisemistä.
HUOM! Versiosta 5 (nykyinen) eteenpäin React Native Paperin lisäksi kannattaa asentaa "safe-area-context"-paketti 
(npm install react-native-paper-safe-area-context), jos haluaa ottaa toteutuksessa nykypuhelinten tyylin, 
jossa ei ole fyysisiä näppäimiä laitteen pinnassa, vaan osana näyttöä. (Esim. iPhonen "Home Bar" näytön alalaidassa) 
"Safe arean" käyttö varmistaa, ettei tällaisille alueille tehdä käyttöliittymäkomponentteja, jotka voivat sekoittaa laitteen muun käytön.
*/