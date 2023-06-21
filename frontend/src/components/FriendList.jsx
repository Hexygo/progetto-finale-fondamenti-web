import React from "react";
import Friend from './Friend'

export default function FriendList({users, setFriendSelected}){
    return (
        <ul>
            {users.map(user=>{return <Friend user={user} setFriendSelected={setFriendSelected}/>})}
        </ul>
    )
}