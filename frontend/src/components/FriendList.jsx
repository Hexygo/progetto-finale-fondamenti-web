import React, { useState, useEffect } from "react";
import Friend from './Friend'

import ListGroup from 'react-bootstrap/ListGroup'
import SearchBar from "./SearchBar";


export default function FriendList({friends, onlineUsers, setFriendSelected}){
    const [search, setSearch]=useState('')//Variabile di stato della ricerca nella lista amici
    const [filteredUsers, setFilteredUsers]=useState(friends)//Lista amici filtrata tramite la ricerca
    
    useEffect(()=>{//Filtra gli amici
        console.log(onlineUsers)
        setFilteredUsers(friends.filter(el=>el.username.toLowerCase().includes(search.toLowerCase())))
    }, [search, friends])

    return (
        <ListGroup as='ul' variant="flush" className="sticky-top">
            <SearchBar search={search} setSearch={setSearch} submitHandler={()=>{return}}/>
            {filteredUsers.length !==0 ?
                <ListGroup as='ul' variant="flush" className="rounded">
                    {filteredUsers.map(user=>{
                        let connected=false;
                        onlineUsers.forEach(userSocket=>{
                            if(userSocket.userID===user._id && userSocket.connected){
                                connected=true
                            }
                        })
                        return <Friend key={user.userID} user={user} setFriendSelected={setFriendSelected} connected={connected}/>})/*Compone la lista di amici*/}
                </ListGroup>:
                friends.length!==0 ? 'Nessun amico trovato.':'Per iniziare a chattare aggiungi un amico dal menu al lato.'
            }
        </ListGroup>
    )
}