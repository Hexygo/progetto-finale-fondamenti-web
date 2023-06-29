import React, { useState, useEffect } from "react";
import Friend from './Friend'

import ListGroup from 'react-bootstrap/ListGroup'
import SearchBar from "./SearchBar";


export default function FriendList({friends, onlineUsers, friendSelected, setFriendSelected }){
    const [search, setSearch]=useState('')//Variabile di stato della ricerca nella lista amici
    const [filteredUsers, setFilteredUsers]=useState(friends)//Lista amici filtrata tramite la ricerca
    
    useEffect(()=>{//Filtra gli amici
        setFilteredUsers(friends.filter(el=>el.username.toLowerCase().includes(search.toLowerCase())))
    }, [search, friends])

    const sortOnlineFirst=(a,b)=>{//Permette agli utenti online di comparire alla cima della lista
        let aOn, bOn=false
        onlineUsers.forEach(userSocket=>{
            if(userSocket.userID===a._id && userSocket.connected)
                aOn=true
            if(userSocket.userID===b._id && userSocket.connected)
                bOn=true
        })
        return aOn===bOn? 0 : aOn ? -1:1
    }

    return (
        <ListGroup as='ul' variant="flush" className="sticky-top">
            <SearchBar search={search} setSearch={setSearch} submitHandler={()=>{return}}/>
            {filteredUsers.length !==0 ?
                <ListGroup as='ul' variant="flush" className="rounded">
                    {filteredUsers.sort(sortOnlineFirst).map(user=>{
                        let connected=false;
                        onlineUsers.forEach(userSocket=>{
                            if(userSocket.userID===user._id && userSocket.connected){
                                connected=true
                            }
                        })
                        return <Friend key={user.userID} user={user} setFriendSelected={setFriendSelected} connected={connected} friendSelected={friendSelected}/>})/*Compone la lista di amici*/}
                </ListGroup>:
                friends.length!==0 ? 
                    'Nessun amico trovato.':
                    'Per iniziare a chattare aggiungi un amico dal menu al lato.'
            }
        </ListGroup>
    )
}