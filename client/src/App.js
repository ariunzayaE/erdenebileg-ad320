import React from 'react';  // added part
//import logo from './logo.svg';
import './App.css';
import TopBar from './components/TopBar/TopBar'  // added part
import CardNavigation from './components/CardNavigation/CardNagivation'
import FlashCard from './components/FlashCard/FlashCard'
import Button from './components/Button/Button'

// to reduce repeatness
const controls = ['Back', 'Flip', 'Next']

function App() {
  return (
    <React.Fragment>
      <TopBar/>
      <div className="container">
        <CardNavigation/>
        <div className='card-container'>
          <FlashCard/>
          <div className='card-controls'>
            {controls.map((control)=>{
                return <Button>{control}</Button>
            })}

                  {/* 
                    <Button>Back</Button>
                    <Button>Flip</Button>
                    <Button>Next</Button>   
                    */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
