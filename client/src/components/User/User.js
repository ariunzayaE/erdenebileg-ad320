import React from 'react'

const User = ({ user }) => {
    const {firstName, _id, decks } = user
    return (
        <>
        <span>{firstName}</span>
        <span>{_id}</span>
        <ul>
        {decks.map((deck) => {
            return <li key={deck._id}>{deck.name}</li>
        })}    
        </ul>
        </>
    )
}
