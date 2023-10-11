import { configureStore } from '@reduxjs/toolkit'; // tällä voidaan määritellä se store
import tehtavalistaReducer from './tehtavalistaSlice'; // tuodaan slicestä reduceri

export const store = configureStore({ // siinä määritellään store, parametri on objekti, jossa on määritelty
                                    // reducerit, mistä store koostuu
    reducer : {
        tehtavalista : tehtavalistaReducer // tänne se reduceri
    }
});

export type RootState = ReturnType<typeof store.getState>; // tämä on storen state tyyppi
export type AppDispatch = typeof store.dispatch; // tuossa dispatchin tyyppi

// tänne tilat ja funktiot

// store kytketään indexiin, niin saat käyttöön