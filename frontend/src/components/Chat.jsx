import React, { useEffect } from "react";
import { useState } from "react";
import socket from "../socket";
import axiosInstance from '../axios'

export default function Chat({user, otherUser}){
    const [message, setMessage]=useState('')
    const [conversation, setConversation]=useState([])

    useEffect(()=>{
        console.log('user',user,'otherUser', otherUser)
        axiosInstance({
            method:'post',
            url:'http://localhost:3000/api/messages/conversation',
            data:{
                user:user._id,
                otherUser:(otherUser.user?otherUser.user._id:otherUser._id)}
        }).then(data=>{
            console.log(data)
            setConversation(data.data)
        })
    },[otherUser, user])

    const handleSubmit=(e)=>{
        e.preventDefault()

        axiosInstance({
            method:'post',
            url:'http://localhost:3000/api/messages/send',
            data:{
                sender:user._id,
                receiver:(otherUser.user?otherUser.user._id:otherUser._id),
                content:message
            },
            withCredentials:true
        }).then(data=>{
            console.log(otherUser.userID)
            socket.emit('message', {
                message:data.data,
                to:otherUser.userID
            })
            setConversation([...conversation, data.data])
            setMessage('')
        })
    }

    socket.on('message',({message, from})=>{//Riceve un messaggio dal socket FROM, con contenuto message, la logica senza socket va ancora definita
        if(otherUser.userID===from)
            setConversation([...conversation, message])
        else
            console.log('messaggio da ', from)//notifica di messsaggio da parte di x
    })

    return(
        <>  
            {conversation?conversation.map(el=>{return (<p><b>{el.sender.username}:</b>{el.content}</p>)}):''/*TODO:Creare il componente Message*/}
            <form onSubmit={handleSubmit}>
                <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Scrivi un messaggio..."></input>
                <button type="submit"></button>
            </form>
        </> 
    )
}