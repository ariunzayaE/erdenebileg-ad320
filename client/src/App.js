import React from 'react';  // added part
//import logo from './logo.svg';
import './App.css';
import TopBar from './components/TopBar/TopBar'  // added part
import CardNavigation from './components/CardNavigation/CardNagivation'
import FlashCard from './components/FlashCard/FlashCard';

function App() {
  return (
    <React.Fragment>
      <TopBar/>
      <div className="container">
        <CardNavigation/>
        <FlashCard/>
      </div>
    </React.Fragment>
  );
}

export default App;
