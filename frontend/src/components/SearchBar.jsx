import React, { useState } from "react"

import ListGroup from 'react-bootstrap/ListGroup'

import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Fade from 'react-bootstrap/Fade'

import { faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SearchBar({ search, setSearch }) {
    const [searchIcon, setSearchIcon] = useState(true)

    return (
        <ListGroup.Item>
            <InputGroup>
                <InputGroup.Text>
                    <FontAwesomeIcon icon={searchIcon ? faSearch : faArrowLeft} onClick={() =>{ setSearchIcon(!searchIcon); setSearch('')}} />
                </InputGroup.Text>
                    <Fade in={!searchIcon} dimension='width'>
                        <Form.Control disabled={searchIcon}value={search} placeholder="Cerca una chat..." onChange={(e) => { setSearch(e.target.value) }} />{/*Modifica il filtro*/}
                    </Fade>
            </InputGroup>
        </ListGroup.Item>
    )
}

