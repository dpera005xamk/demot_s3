import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Text } from 'react-native-paper';
import { Camera, CameraCapturedPicture, PermissionResponse } from 'expo-camera';
import { useRef, useState } from 'react';

interface Kuvaustiedot {
  kuvaustila : boolean,
  virhe : string
  kuva? : CameraCapturedPicture // tämä ilmeisesti otetun kuvan "virallinen" type
  info : string
}

const App : React.FC = () : React.ReactElement => {

                  // voi käyttää ihan anyä, ettei tule turhaa koodia, joka ei vaikuta lopputulokseen
  const kameraRef : any = useRef<Camera>(); // tähän viite tohon Camera komponenttiin
  
  const [kuvaustiedot, setKuvaustiedot] = useState<Kuvaustiedot>({
                                                                  kuvaustila : false, // ollaanko kuvaustilassa
                                                                  virhe : "", // jos tuli virheitä
                                                                  info : "" // infoa varten
                                                                });

  const kaynnistaKamera = async () : Promise<void> => {

    const kameralupa : PermissionResponse = await Camera.getCameraPermissionsAsync();
    // saat sopivat console.log(kameralupa);
    setKuvaustiedot({ // expo go lupa kehitysvaiheessa, käännetyssä koodissa lupa sitten siihen appiin
      ...kuvaustiedot, 
      kuvaustila : kameralupa.granted, // kun saadaan granted, niin voidaan laittaa kuvaustilaan, eli sama kun se lupa, true tai false
      virhe : (!kameralupa.granted) ? "Ei lupaa kameran käyttöön." : "" // jos ei ole annettu, niiin error teksti.
    });

  }

  const otaKuva = async () : Promise<void> => {

    setKuvaustiedot({
      ...kuvaustiedot,
      info : "Odota hetki..."
    });
                                              // käytetään tuota reffiä
    const apukuva : CameraCapturedPicture = await kameraRef.current.takePictureAsync()
    console.log(apukuva); // näyttää tiedot, esim. height, uri, width.. ei taida näyttää muuta


    setKuvaustiedot({
      ...kuvaustiedot,
      kuvaustila : false, // sammuu kuvaustila
      kuva : apukuva,
      info : ""
    });


  }

  return ( // eli nyt kuvaustilalla jaetaan sovellus kahteen osaan
    (kuvaustiedot.kuvaustila) 
    ? <Camera style={styles.kuvaustila} ref={kameraRef}> // kamera käynnissä, TÄMÄ kamera on sitten kytkettävä tohon kuvan ottoon, siksi ref

          {(Boolean(kuvaustiedot.info))  // jos info on niin näytetään
            ? <Text style={{ color : "#fff"}}>{kuvaustiedot.info}</Text> // valkonen
            : null
          }

        <FAB // floating action button. menee kaikkien päälle
          style={styles.nappiOtaKuva}
          icon="camera" // materialdesignicon.com, jossa näkee nämä ikonit, react nativessa ei tarvii importata näitä
          label="Ota kuva"
          onPress={otaKuva}
        />

        <FAB 
          style={styles.nappiSulje}
          icon="close" // raksi
          label="Sulje"
          onPress={ () => setKuvaustiedot({...kuvaustiedot, kuvaustila : false})} // eli pistää kuvaustilan falseksi
        />

      </Camera>
    : <>
        <Appbar.Header>
          <Appbar.Content title="Demo 6: Kamera" />
          <Appbar.Action 
            icon="camera"
            onPress={kaynnistaKamera}
          />
        </Appbar.Header>
        <View style={styles.container}>

          {(Boolean(kuvaustiedot.virhe)) 
            ? <Text>{kuvaustiedot.virhe}</Text>
            : null
          }

          {(Boolean(kuvaustiedot.kuva)) // jos on otettu kuva, niin näyttää
           ? <Image 
                style={styles.kuva} // pitää olla mitat, tai ei näytä
                source={{uri : kuvaustiedot.kuva!.uri}} // tämä näyttää sen, voi olla undefined, siksi huutomerkki
             />
            : null
          }

          <StatusBar style="auto" />
        </View>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kuvaustila: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nappiSulje: {
    position : 'absolute',// absoluuttinen sijainti oikealle ja alas, ja marginia vähä, ettei ihan reunassa
    margin : 20,
    bottom : 0,
    right : 0
  },
  nappiOtaKuva: {
    position : 'absolute', // absoluuttinen sijainti vasemmalle ja alas, ja marginia vähä, ettei ihan reunassa
    margin : 20,
    bottom : 0,
    left : 0
  },
  kuva: {
    width : 300,
    height : 400,
    resizeMode : 'stretch' // pienentää 10 osaan kuvan, että mahtuu ruudulle
  }
});

export default App;
