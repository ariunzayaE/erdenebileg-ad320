import React from 'react'

const User = ({ user }) => {
    const {firstName, lastName, email, _id, decks } = user
    return (
        <>
        <span>{firstName}</span>
        <span>{lastName}</span>
        <span>{email}</span>
        <span>{_id}</span>
        <ul>
        {decks.map((deck) => {
            return <li key={deck._id}>{deck.name}</li>
        })}    
        </ul>
        </>
    )
}
export default User
