import React, { useState } from "react"

import ListGroup from 'react-bootstrap/ListGroup'

import Form from 'react-bootstrap/Form'

import { faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SearchBar({ search, setSearch, submitHandler }) {
    const [searchIcon, setSearchIcon] = useState(true)

    const handleSubmit=(e)=>{
        e.preventDefault()
        submitHandler(search)
    }

    return (
        <ListGroup.Item className="d-flex flex-row align-items-center m-4 border rounded-pill sticky-top" style={{'background-color':'#3e3f48'}}>
            <FontAwesomeIcon className="mx-2" icon={searchIcon ? faSearch : faArrowLeft} onClick={() => { setSearchIcon(!searchIcon); setSearch('') }} />
            <Form onSubmit={handleSubmit}>
                <Form.Control className='rounded-pill border-0 shadow-0' style={{'box-shadow':'none', 'background-color':'#3e3f48'}} value={search} placeholder="Cerca" onChange={(e) => { setSearch(e.target.value) }} onFocus={() => setSearchIcon(!searchIcon)} />
            </Form>
        </ListGroup.Item>
    )
}

