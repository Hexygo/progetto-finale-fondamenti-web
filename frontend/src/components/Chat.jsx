import React, { useEffect } from "react";
import { useState } from "react";
import socket from "../socket";
import axiosInstance from '../axios'

export default function Chat({user, otherUser}){
    const [message, setMessage]=useState('')
    const [conversation, setConversation]=useState()

    useEffect(()=>{
        console.log('user',user,'otherUser', otherUser)
        axiosInstance({
            method:'post',
            url:'http://localhost:3000/api/messages/conversation',
            data:{
                user:user._id,
                otherUser:otherUser.user._id
            }
        }).then(data=>{
            console.log(data)
            setConversation(data.data)
        })
    },[otherUser, user])

    const handleSubmit=(e)=>{
        e.preventDefault()
        socket.emit('message', {
            message:message,
            to:otherUser.userID
        })
        axiosInstance({
            method:'post',
            url:'http://localhost:3000/api/messages/send',
            data:{
                sender:user._id,
                receiver:otherUser.user._id,
                content:message
            },
            withCredentials:true
        }).then(data=>{
            setConversation([...conversation, data.data])
            setMessage('')
        })
    }

    socket.on('message',({message, from})=>{//Riceve un messaggio dal socket FROM, con contenuto message, poi vediamo cosa farne
        
    })

    return(
        <>  
            {conversation?conversation.map(el=>{return (<p>{el.content}</p>)}):''}
            <form onSubmit={handleSubmit}>
                <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Scrivi un messaggio..."></input>
                <button type="submit"></button>
            </form>
        </> 
    )
}