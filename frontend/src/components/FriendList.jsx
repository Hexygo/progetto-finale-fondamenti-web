import React, { useState, useEffect } from "react";
import Friend from './Friend'

import ListGroup from 'react-bootstrap/ListGroup'
import SearchBar from "./SearchBar";


export default function FriendList({friends, onlineUsers, friendSelected, setFriendSelected, removeFriend }){
    const [search, setSearch]=useState('')//Variabile di stato della ricerca nella lista amici
    const [filteredUsers, setFilteredUsers]=useState(friends)//Lista amici filtrata tramite la ricerca
    
    useEffect(()=>{//Filtra gli amici
        setFilteredUsers(friends.filter(el=>el.username.toLowerCase().includes(search.toLowerCase())))
    }, [search])

    useEffect(()=>{
        console.log(friends, onlineUsers, filteredUsers)
        setFilteredUsers(friends.map((el=>{
            onlineUsers.forEach((ou=>{
                if(ou.userID===el._id)
                    el.connected=ou.connected
            }))
            return el
        })))
        console.log(filteredUsers)
    }, [onlineUsers, friends])

    useEffect(()=>{
        setFilteredUsers([...friends])
    }, [friends])

    return (
        <ListGroup as='ul' variant="flush" className="sticky-top">
            <SearchBar search={search} setSearch={setSearch} submitHandler={()=>{return}}/>
            {filteredUsers.length !==0 ?
                <ListGroup as='ul' variant="flush" className="rounded overflow-y-auto" style={{height:'80vh'}}>
                    {filteredUsers.map(user=>{
                        return <Friend key={user._id} user={user} setFriendSelected={setFriendSelected} friendSelected={friendSelected} connected={user.connected} removeFriend={removeFriend}/>})/*Compone la lista di amici*/}
                </ListGroup>:
                friends.length!==0 ? 
                    'Nessun amico trovato.':
                    'Per iniziare a chattare aggiungi un amico dal menu al lato.'
            }
        </ListGroup>
    )
}