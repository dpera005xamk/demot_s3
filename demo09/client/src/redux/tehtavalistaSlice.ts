import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'; // slice looginen nimi

// thunk functio, eli asyncin tyyppinen funktio parat: nimi, ei tarvii olla sama nimi, mutta loogisempaa
//                      tarkenna, että minkä slicen, eli tehtavalista, ja sitten async funktio on toinen parametri
export const haeTehtavat = createAsyncThunk("tehtavalista/haeTehtavat", async () => {

    const yhteys = await fetch("http://localhost:3001/api/tehtavalista");
    return await yhteys.json();  
    // tänne ei voi setteriä käyttää, tai laitta, että state on sitä ja tätä
    // eli palautat ton yhteyksen (tai muun mitä ootat)
});

// thunk functio, eli asyncin tyyppinen funktio
// pitäisi saada tuo getState tähän, niin sen voi tuoda näin parametrinä, toinen parametri on store, ja sieltä getState
export const tallennaTehtavat = createAsyncThunk("tehtavalista/tallennaTehtavat", async (payload, {getState}) => {

    const yhteys = await fetch("http://localhost:3001/api/tehtavalista", {
        method : "POST",
        headers  : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(getState())
    });
    return await yhteys.json();

});

export interface Tehtava {
    id : string,
    nimi : string,
    suoritettu : boolean
  }

interface State {
    tehtavat : Tehtava[];
    lisaysDialogi : boolean;
    poistoDialogi : {
        auki : boolean;
        tehtava : Tehtava;
    }
}

const tehtavat : Tehtava[] = [];

// tehdään slice
export const tehtavalistaSlice = createSlice({
    name : "tehtavalista",  // 1. nimi
    initialState : {   // 2. tila alussa
        tehtavat : [...tehtavat], // hyvä spredata, niin tulee uusimmat arvot varmasti
        lisaysDialogi : false,
        poistoDialogi : {
            auki : false,
            tehtava : {}
        }
    } as State, // tällein tyypitetään tämä (castaaminen)
    reducers : { // 3. täällä voi olla reducereja myös. kolme pakollista
        lisaaTehtava : (state : State, action : PayloadAction<Tehtava>) => { // tän hetkinen state ja toiminto
            state.tehtavat = [...state.tehtavat, action.payload] // actionissa on payload, eli mitä meni parametriin
                                            // typessä lukee, että minkä niminen se kutsu oli
        },
        poistaTehtava : (state : State, action : PayloadAction<string>) => {
            state.tehtavat = [...state.tehtavat.filter((tehtava : Tehtava) => tehtava.id !== action.payload)]
        },
        vaihdaSuoritus : (state : State, action : PayloadAction<string>) => {

            let idx : number = state.tehtavat.findIndex((tehtava : Tehtava) => tehtava.id === action.payload);

            state.tehtavat[idx].suoritettu = !state.tehtavat[idx].suoritettu;

        },
        avaaLisaysDialogi : (state : State, action : PayloadAction<boolean>) => {
            state.lisaysDialogi = action.payload;
        },
        avaaPoistoDialogi : (state : State, action : PayloadAction<any>) => {
            state.poistoDialogi = action.payload;
        }
    }, // lisä reducerix, funktiot, jotka käyttää apuobjektia builder.
    // builderit on vähän niinku kuuntelijoita, jotka kuuntelee, että jos Thunk funktio on suoritettu,
    // niin tapahtuu seuraavaa.
    extraReducers : (builder : any) => {
                        //haeTehtavat suoritettu, niin tapahtuu seuraaavaa. Parametreiksi tulee
                        // state ja action, kuten muissakin reductereissa
                        // käynnistä vaikka App komponentissa, nää pitää käynnistää
                        // payloadiin tulee toki se minkä nuo palauttaa
        builder.addCase(haeTehtavat.fulfilled, (state : State, action : PayloadAction<Tehtava[]>) => {
            state.tehtavat = action.payload;
        }).addCase(tallennaTehtavat.fulfilled, (state : State, action : PayloadAction<any>) => {
            console.log("Tallennettu!")
        })
    }
});
        // actionsista löytyy kaikki reducerit, ne voi sieltä levittää
export const { lisaaTehtava, poistaTehtava, vaihdaSuoritus, avaaLisaysDialogi, avaaPoistoDialogi } = tehtavalistaSlice.actions;

export default tehtavalistaSlice.reducer;