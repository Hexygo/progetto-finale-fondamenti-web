import React from "react";

export default function Friend({user, setFriendSelected}){

    
    return(
        <li onClick={()=>{setFriendSelected(user)}}>Username{user.self?"(You)":""}: {user.user.username}{user.connected?'(online)':'(offline)'}</li>
    )
}