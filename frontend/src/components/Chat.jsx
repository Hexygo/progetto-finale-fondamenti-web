import React from "react";
import { useState } from "react";

export default function Chat({user, otherUser}){
    const [message, setMessage]=useState('')

    const handleSubmit=(e)=>{
        e.preventDefault()
        console.log('submitting...')
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Scrivi un messaggio..."></input>
                <button type="submit"></button>
            </form>
        </> 
    )
}