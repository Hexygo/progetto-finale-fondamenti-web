import React, { useEffect } from "react";
import { useState } from "react";
import socket from "../socket";
import axiosInstance from '../axios'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Message from "./Message";

export default function Chat({user, otherUser}){
    const [message, setMessage]=useState('')
    const [conversation, setConversation]=useState([])

    useEffect(()=>{
        axiosInstance({
            method:'post',
            url:'http://localhost:3000/api/messages/conversation',
            data:{
                user:user._id,
                otherUser:(otherUser.user?otherUser.user._id:otherUser._id)}
        }).then(data=>{
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
            socket.emit('message', {
                message:data.data,
                to:otherUser._id
            })
            setConversation([...conversation, data.data])
            setMessage('')
        })
    }

    socket.on('message',({message, from})=>{//Riceve un messaggio dal socket FROM, con contenuto message, la logica senza socket va ancora definita
        if(otherUser._id===from)
            setConversation([...conversation, message])
        else
            console.log('messaggio da ', from)//notifica di messsaggio da parte di x
    })

    return(
            <Container className="vh-100 position-relative pt-4" >
                <Row className="justify-content-center display-6 rounded-top border" style={{height:'50px', fontFamily:'Roboto Condensed, sans-serif'}}>{otherUser.username}</Row>
                <Row>
                    <Container id="chat-container" className="overflow-y-auto d-flex flex-column-reverse border rounded-bottom" style={{height:'80vh'}}>
                        <div>{/*Questo div permette al contenuto di non venire rovesciato*/}
                            {conversation?conversation.map((el,index,thearray)=>{
                                if(index===0){
                                    return <><Row className="sticky-top lead pt-2 mb-4"><Col className="bg-dark rounded-pill d-flex justify-content-center p-0" md={{span:2,offset:5}} ><div key={new Date(el.time).toLocaleDateString()} className="px-3" style={{fontFamily:'Roboto Condensed, sans-serif'}}>{new Date(el.time).toLocaleDateString()}</div></Col></Row><Message key={el.time} user={user} el={el}/></>
                                }
                                else{
                                    return new Date(thearray[index].time).toLocaleDateString()!==new Date(thearray[index-1].time).toLocaleDateString() ?
                                      <><Row className="sticky-top lead pt-2 mb-4"><Col className="bg-dark rounded-pill d-flex justify-content-center p-0" md={{span:2,offset:5}} ><div key={new Date(el.time).toLocaleDateString()} className="px-3" style={{fontFamily:'Roboto Condensed, sans-serif'}}>{new Date(el.time).toLocaleDateString()}</div></Col></Row><Message key={el.time} user={user} el={el}/></> :
                                      <Message key={el.time} user={user} el={el}/>
                                }
                                }):''}
                        </div>
                    </Container>
                </Row>
                <Row className="text-center sticky-bottom pt-2">
                    <Col md={12}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Control type="text" size="lg" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Scrivi un messaggio..."></Form.Control>
                            <Button className="invisible" type="submit"></Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
    )
}
