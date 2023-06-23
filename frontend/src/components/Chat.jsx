import React, { useEffect } from "react";
import { useState } from "react";
import socket from "../socket";
import axiosInstance from '../axios'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from "react-bootstrap/esm/Container";

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
            <Container>
                {conversation?conversation.map(el=>{return (<Row className="m-2"><Col md={(el.sender.username===user.username) ? 9 : 0}></Col><Col md={(el.sender.username===user.username) ? 3 : 3}><Card><Card.Body><Card.Text><b>{el.sender.username}:</b>{el.content}</Card.Text></Card.Body></Card></Col><Col md={(el.sender.username===user.username) ? 9 : 0}></Col></Row>)}):''/*TODO:Creare il componente Message*/}
                <Row className="text-center sticky-bottom">
                    <Col md={5}></Col>
                    <Col md={7}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Control type="text" size="lg" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Scrivi un messaggio..."></Form.Control>
                            <Button className="invisible" type="submit"></Button>
                        </Form>
                    </Col>
                    <Col md={0}></Col>
                </Row>
            </Container>
        </> 
    )
}