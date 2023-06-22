import React, { useState } from "react"

import ListGroup from 'react-bootstrap/ListGroup'

import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'

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
                        <Form.Control value={search} placeholder="Cerca una chat..." onChange={(e) => { setSearch(e.target.value) }} onFocus={()=>setSearchIcon(!searchIcon)}/>{/*Modifica il filtro*/}
            </InputGroup>
        </ListGroup.Item>
    )
}

