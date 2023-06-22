import React, { useState } from "react";
import Nav from 'react-bootstrap/Nav'


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";


export default function SideBar({ handleLogout, setFriendMenu }) {
    return (
        <Nav as='ul' navbar className="flex-column">
            <Nav.Link className='text-secondary' as='li' onClick={() => setFriendMenu(true)}>
                    <FontAwesomeIcon className={'fa-2x'} icon={faUserPlus} />
            </Nav.Link>
            <Nav.Link className="text-secondary" as='li' onClick={handleLogout}>
                    <FontAwesomeIcon className={'fa-2x'} icon={faRightFromBracket} />
            </Nav.Link>
        </Nav>)
}