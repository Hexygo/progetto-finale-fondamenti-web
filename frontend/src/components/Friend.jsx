import React from "react";

export default function Friend({user, setFriendSelected}){

    
    return(
        <li onClick={()=>{setFriendSelected(user.user)}}>Username{user.self?"(You)":""}: {user.user.username}</li>
    )
}