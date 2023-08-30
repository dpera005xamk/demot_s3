import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
/*
View on niinku div, tyylitys, voi kirjoittaa style attribuuttiin, tai tehdä luokkia.

*/

const App : React.FC = () : React.ReactElement => {

  const tekstikentta : React.MutableRefObject<any> = useRef<TextInput>();
  const [tervehdys, setTervehdys] = useState<string>("");

  const sanoHeippa = () : void => {

    setTervehdys(`Heippa ${tekstikentta.current.value}!`);
    tekstikentta.current.clear(); // tyhjentää, tuon tekstin tuolta, painalluksen jälkeen.
    // alert("heippa");
    //console.log('morjes'); tulee terminaaliin.
  }


  return (
    <View style={styles.container}>

      <Text style={{ fontSize: 20 }}>Demo 4: React Native -perusteita</Text>
      
      <Text style={styles.alaotsikko}>Hello world</Text>

      <TextInput 
        ref={tekstikentta}
        style={styles.tekstikentta}
        placeholder='Anna nimesi...'
        onChangeText={ (teksti : string) => tekstikentta.current.value = teksti} // eli nyt on tuo teksti, tuo teksti, mitä kirjotettu
      />

      <Button 
        title='Sano heippa'
        onPress={sanoHeippa}      
      />

      {(Boolean(tervehdys)) // jos tyhjä, null, tai undefined, niin tulee false.
        ? <Text style={styles.tervehdys}>{tervehdys}</Text>
        : null
      }
      

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop : 30, // käytä numeroita, ei laiteta px:iä tms.
    padding: 10
  },
  alaotsikko : {
    fontSize : 16,
    marginTop : 10,
    marginBottom : 20,
  },
  tekstikentta : {
    marginBottom : 20,
  },
  tervehdys : {
    fontSize : 14,
    marginTop : 10,
    marginBottom : 20,
  }
});

export default App;

/*
Expo-kehitysympäristö asennetaan komennolla: npx create-expo-app . -t expo-template-blank-typescript
 ja käynnistetään: npx expo start. 
 
 puhelimeen: expo, se on puhelimeen asennettava apuohjelma.
- käynnistä ja sieltä scan qr-code, sitten skannaa se, mikä tuli tietokoneelle, ni se lataa projektin puhelimeen.

.expo kansiot riittyy expoon, ei tarvii muutella. assetsissa on iconit alussa. korvaa vaan sen nimisenä, jos haluaa muutella.
node_modules on tuttu ja muut, mitä reactissa. babel.config.js liittyy kääntöön.

eli app.json, siellä on sovelluksen yleiset asetukset, esim. nimi jne. siellä voi nimetä vaikka ne iconit, jos huvittelee
app.tsx, missä koodi. näyttää aika paljon reactilta.

reactnative.dev dokumentointi, esim. components jne.

alkutilaan: ravista puhelinta ja reload.

nyt vaan expo go:ssa, mutta miten asennetaan?
mene expo.dev
tee tunnukset, käytetään vaikka koulun tunnuksia.
kirjaudu expoon ja siellä voi tehdä, mutta ehkä mukavampi tehdä terminalissa.
dokumentointia siellä Docs kohdassa.
Expo Application Services. EAS. esim. EAS Build. niin tekee pilvessä natiivi koodissa.

- sammuta expo palvelin, control+c
- npx eas-cli login
- tunnukset, saattaa kysyä, että asennetaanko, vastaa yes
- npx eas-cli build:configure
- mikä platformi... vastaa... 
- ios vaatii apple developer vehkeet
- androidiin voi tehdä ilmaisiksi.
- tulee eas.json, jossa määritykset pilvelle.
- preview ja preview2 turhia, ainaki androidilla turhia, eli voi poistaa. eli se buildin preview jätetään, se se profiili
- npx eas-cli build --profile preview   (eli siellä se preview se profiili, mikä tossa eas.json) (tässä menee aikaa)
- valitse taas platformi... kyselee jotain, valitse vaikka oletukset.
- kun buildi valmis, niin antaa linkin, niin siitä lataa tiedoston, jonka voi siirtää puhelimeen ja käynnistää siinä.
- voi mennä expo.dev sivulle/sovellukseen ja sinne on tullut se buildi, niin siinä on download.

*/
