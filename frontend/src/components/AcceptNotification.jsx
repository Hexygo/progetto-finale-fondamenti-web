import { faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useState} from "react";

import Toast from 'react-bootstrap/Toast'

export default function AcceptNotification({user}){
    const [show, setShow]=useState(true)
    
    return(
        <Toast autohide delay={4000} onClose={()=>setShow(false)} show={show}>
            <Toast.Header>
                <FontAwesomeIcon icon={faHeartCircleCheck} className="pe-2 text-success"/>{user.username}
            </Toast.Header>
            <Toast.Body>
                <b>{user.username}</b> ha accettato la tua richiesta d'amicizia!
            </Toast.Body>
        </Toast>
    )
}