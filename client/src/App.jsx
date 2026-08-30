import React from 'react';
import { GasProvider } from './context/GasContext';
import ScreenManager from './components/ScreenManager';
import './styles/gasfinder.css';

const App = () => {
  return (
    <GasProvider>
      <ScreenManager />
    </GasProvider>
  );
};

export default App;
