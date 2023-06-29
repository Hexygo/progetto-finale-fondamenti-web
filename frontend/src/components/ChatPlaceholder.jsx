import React, {useEffect} from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import socket from "../socket";

export default function ChatPlaceholder(messageQueue, setMessageQueue){
    useEffect(()=>{
        socket.on('message',({message, from})=>{//Riceve un messaggio dal socket FROM, con contenuto message
            console.log('sono da Placeholder')
            let temp=messageQueue
            temp.push(message)
            setMessageQueue([...temp])
            setTimeout(()=>{
                let temp=messageQueue
                temp.shift()
                setMessageQueue([...temp])
            }, 5000)
        })
    })

    return(
        <Container className="vh-100 position-relative py-4" >

        </Container>
    )
}