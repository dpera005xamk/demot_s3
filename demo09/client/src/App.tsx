import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Stack } from '@mui/material';
import Otsikko from './components/Otsikko';
import Tehtavalista from './components/Tehtavalista';
import LisaaTehtava from './components/LisaaTehtava';
import { AppDispatch, RootState } from './redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { avaaLisaysDialogi, haeTehtavat } from './redux/tehtavalistaSlice';

interface Tehtava {
  id : string,
  nimi : string,
  suoritettu : boolean
}

const App : React.FC = () : React.ReactElement => {

  const haettu : React.MutableRefObject<boolean> = useRef(false);

  const dispatch : AppDispatch = useDispatch(); // dispatch on funktio, jonka parametriksi menee funktio

  useEffect(() => {

    if (!haettu.current) {
      dispatch(haeTehtavat()); // siinä käynnistetään thunk funktio
    }
        
    return () => { haettu.current = true }
  }, [dispatch]); // kun toi tehdään ekaa kertaa, niin tehdään tuo

  return (
    <Container>
      <Stack spacing={2}>
              
      <Otsikko />

      <Button 
        variant="contained"
        onClick={() => dispatch(avaaLisaysDialogi(true))} // eli parametriksi se funktio, mikä halutaan
      >Lisää uusi tehtävä</Button>

      <Tehtavalista />

      <LisaaTehtava />

      </Stack>
    </Container>
  );
}

export default App;

/*
npm install react-redux @reduxjs/toolkit
*/
