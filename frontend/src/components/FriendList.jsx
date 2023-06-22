import React, { useState, useEffect } from "react";
import Friend from './Friend'

import ListGroup from 'react-bootstrap/ListGroup'
import SearchBar from "./SearchBar";


export default function FriendList({users, setFriendSelected}){
    const [search, setSearch]=useState('')//Variabile di stato della ricerca nella lista amici
    const [filteredUsers, setFilteredUsers]=useState(users)//Lista amici filtrata tramite la ricerca
    
    useEffect(()=>{//Filtra gli amici
        setFilteredUsers(users.filter(el=>el.user.username.toLowerCase().includes(search.toLowerCase())))
    }, [search, users])

    return (
        <ListGroup as='ul' variant="flush">
            <SearchBar search={search} setSearch={setSearch}/>
            {filteredUsers.map(user=>{return <Friend key={user.userID} user={user} setFriendSelected={setFriendSelected}/>})/*Compone la lista di amici*/}
        </ListGroup>
    )
}