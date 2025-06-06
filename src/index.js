import React from 'react';
import ReactDOM from 'react-dom/client';
import { DataProvider } from './components/context/DataProvider';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>
);


