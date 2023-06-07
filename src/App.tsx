import React from 'react';
import { Header } from './modules/header';
import { Main } from './modules/main';

function App() {
  return (
    <div className='App bg-stone-100'>
      <div className='container mx-auto '>
        <Header/>
        <Main/>
      </div>
    </div>
  );
}

export default App;
