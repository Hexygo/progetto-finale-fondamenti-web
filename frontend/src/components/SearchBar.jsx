import React, { useState } from "react"

import ListGroup from 'react-bootstrap/ListGroup'

import Form from 'react-bootstrap/Form'

import { faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SearchBar({ search, setSearch }) {
    const [searchIcon, setSearchIcon] = useState(true)

    return (
        <ListGroup.Item className="d-flex flex-row align-items-center m-4 border rounded-pill sticky-top">
            <FontAwesomeIcon className="mx-2" icon={searchIcon ? faSearch : faArrowLeft} onClick={() => { setSearchIcon(!searchIcon); setSearch('') }} />
            <Form>
                <Form.Control className='rounded-pill border-0 shadow-0' value={search} placeholder="Cerca" onChange={(e) => { setSearch(e.target.value) }} onFocus={() => setSearchIcon(!searchIcon)} />{/*Modifica il filtro*/}
            </Form>
        </ListGroup.Item>
    )
}

