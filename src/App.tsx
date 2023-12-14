import React from 'react';

import Map from './Components/Map';
import Drop from './Components/Drop';

function App() {
  return (
    <div style={{ width: '90vw', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>Map App</h1>
      <Drop />
      <Map />
    </div>
  );
}

export default App;