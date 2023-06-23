import React from "react";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";

export default function FriendRequest({request}){
    return (
        <ListGroupItem as='li'>
            {request._id}
        </ListGroupItem>
    )
}