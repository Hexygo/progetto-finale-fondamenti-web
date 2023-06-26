import { faCheck, faXmark, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Row from "react-bootstrap/Row";

export default function FriendRequest({ request }) {
    let active = false;
    return (
        <ListGroupItem fluid as='li' className="container-fluid position-relative px-3" style={{height:'50px'}}>
                <Row className="d-flex">
                    <Col xs='7' className="d-flex position-absolute top-50 translate-middle-y">
                        {request.username}
                    </Col>
                    <Col className="d-flex position-absolute top-50 end-0 justify-content-end translate-middle-y">
                        <Button variant="dark" className="rounded-pill border-0" onClick={() => active = !active} active={active}>
                            <FontAwesomeIcon className="text-success" icon={faCheck} />
                        </Button>
                        <Button variant="dark" className="rounded-pill border-0" onClick={() => active = !active} active={active}>
                            <FontAwesomeIcon className="text-danger" icon={faXmark} />
                        </Button>
                    </Col>
                </Row>
        </ListGroupItem>
    )
}