import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TehtavaProvider } from './context/TehtavaContext'; // tänne hyvä jakaa

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <TehtavaProvider> // tässä se provideri, voi toki jakaa myös osille
      <App />
    </TehtavaProvider> 
  </React.StrictMode>
);
