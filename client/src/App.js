import React from 'react'; 
import './App.css';
import TopBar from './components/TopBar/TopBar'
import CardNavigation from './components/CardNavigation/CardNagivation'
import FlashCard from './components/FlashCard/FlashCard'
import Button from './components/Button/Button'

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
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
