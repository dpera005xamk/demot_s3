import React, { createContext, useEffect, useRef, useState } from 'react';

// pyritään tekee kaikki täällä ja jaetaan niitä sitten komponentteihin.

// huom, exporttaa
export const TehtavaContext : React.Context<any> = createContext(undefined);

export interface Tehtava {
    id : string,
    nimi : string,
    suoritettu : boolean
  }
  

interface Props {
    children : React.ReactNode;
}

// huom, exportaa
export const TehtavaProvider : React.FC<Props> = (props : Props) : React.ReactElement => {

    const haettu : React.MutableRefObject<boolean> = useRef(false);
    
    const [lisaysDialogi, setLisaysDialogi] = useState<boolean>(false);
    const [poistoDialogi, setPoistoDialogi] = useState<any>({
        tehtava : {},
        auki : false
      });

      
    const [tehtavat, setTehtavat] = useState<Tehtava[]>([]);

    const lisaaTehtava = (uusiTehtava: Tehtava) : void => {

        tallennaTehtavat([...tehtavat, uusiTehtava]); 

    }

    const vaihdaSuoritus = (id : string) : void => {
                                    // spreadaa ja palauttaa sen mitä löytyy....huutis tossa, undefinedin varalle
        let vaihdettava : Tehtava = {...tehtavat.find((tehtava : Tehtava) => tehtava.id === id)!} 
                                    // saat indexin tällä, jos ei löydy, niin -1
        let vaihdettavaIdx : number = tehtavat.findIndex((tehtava : Tehtava) => tehtava.id === id);
            // nykyiset tehtävät 
        let apuTehtavat : Tehtava[] = [...tehtavat];
                // on vastakohta, kuin vaihdettava suoritusmerkintä, eli false, true, ns. topple
        apuTehtavat[vaihdettavaIdx].suoritettu = !vaihdettava.suoritettu;

        tallennaTehtavat([...apuTehtavat]);

    }
    
    // hyvä tapa tehdä tänne käsittely functio, joka jaetaan
    const poistaTehtava = (id: string) : void => {
        // huom, tässä käytetään samaa tallentamista
        tallennaTehtavat([...tehtavat.filter((tehtava : Tehtava) => { return tehtava.id !== id })]); 

    }

    const tallennaTehtavat = async (tehtavat : Tehtava[]) => {

        const yhteys = await fetch("http://localhost:3001/api/tehtavalista", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({tehtavat})   
        });
        // tässä järjestyksessä, eli eka palvelimelle ja sitten setteri
        setTehtavat([...tehtavat]);

    }

    const haeTehtavat = async () => {

        const yhteys = await fetch("http://localhost:3001/api/tehtavalista");
        const data = await yhteys.json();  
        setTehtavat(data);
    
      };
    
      useEffect(() => {
    
        if (!haettu.current) {
          haeTehtavat();
        }
            
        return () => { haettu.current = true }
      }, []);
    
    return (                            // eli vielä parempi oisi nuo funktionit laittaa, jotka tallettaa
                                        // palvelimelle. esim. niinku tuo lisaaTehtava
        <TehtavaContext.Provider value={{   tehtavat,  // nämä kaikki sitten on kaikkialla käytössä
                                            setTehtavat,  // huom, objekti, eli kaksi aaltosulkua
                                            lisaysDialogi, // nimi ja sisältö sama, niin yksi sana riittää
                                            setLisaysDialogi,
                                            poistoDialogi, 
                                            setPoistoDialogi,
                                            lisaaTehtava,
                                            poistaTehtava,
                                            vaihdaSuoritus
                                        }}>
            {props.children}
        </TehtavaContext.Provider>
    );
}