import React from 'react'
import './TopBar.css'

/* We can declare function using const arrow or function TopBar

const TopBar = () => {

}
*/


// only wrapping tag per return statement
function TopBar() {
    return <div className="bar">
        <h2 className="bar-title">Notable</h2>
        </div> 
        
}

export default TopBar;