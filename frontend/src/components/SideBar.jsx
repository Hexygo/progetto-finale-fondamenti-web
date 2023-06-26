import React, { useState } from "react";
import Nav from 'react-bootstrap/Nav'


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";


export default function SideBar({ handleLogout, setFriendMenu, friendMenu }) {
    return (
        <Nav as='ul' navbar className="flex-column position-relative vh-100 sticky-top" style={{'z-index':'1100'}}>
            <Nav.Link className='text-secondary p-2 position-absolute start-50 translate-middle-x' as='li' onClick={() => setFriendMenu(!friendMenu)}>
                    <FontAwesomeIcon className='fa-2x' icon={faUserPlus} style={friendMenu?{color:'#1a5fb4', '--fa-animation-iteration-count':'1'}:{}} bounce={friendMenu}/>
            </Nav.Link>
            <Nav.Link className="text-secondary p-2 position-absolute start-50 translate-middle-x bottom-0" as='li' onClick={handleLogout}>
                    <FontAwesomeIcon className='fa-2x' icon={faRightFromBracket} />
            </Nav.Link>
        </Nav>)
}