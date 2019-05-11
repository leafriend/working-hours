import React from 'react';

import './App.css';
import { Header } from './Header';

const MONTH = '2019-05';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header
        month={MONTH}
      />
    </div>
  );
}

export default App;
