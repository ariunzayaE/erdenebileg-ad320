import React from 'react'

// we need to props in the curly braces - react interprets as variable props
function Button(props){
    return (
    <button>{props.children}</button>
    )
}
export default Button