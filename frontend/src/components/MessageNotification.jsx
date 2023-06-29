import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useState} from "react";

import Toast from 'react-bootstrap/Toast'

export default function MessageNotification({message}){
    const [show, setShow]=useState(true)
    
    return(
        <Toast autohide delay={4000} onClose={()=>setShow(false)} show={show}>
            <Toast.Header>
                <FontAwesomeIcon icon={faPaperPlane} className="pe-2"/><b className="me-auto">{message.sender.username}</b>
            </Toast.Header>
            <Toast.Body>
                <div className="d-inline-block text-truncate" style={{maxWidth:'100%'}}>{message.content}</div>
            </Toast.Body>
        </Toast>
    )
}