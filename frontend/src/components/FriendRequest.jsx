import { faCheck, faXmark, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/esm/Container";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Row from "react-bootstrap/Row";

export default function FriendRequest({ request }) {
    let active = false;
    return (
        <ListGroupItem fluid as='li' className="bg-light">
            <Container fluid>
                <Row>
                    <Col xs='7'>
                        {request.username}
                    </Col>
                    <Col >
                        <Button variant="light" className="rounded-pill border-0" onClick={() => active = !active} active={active}>
                            <FontAwesomeIcon className="text-success" icon={faCheck} />
                        </Button>
                        <Button variant="light" className="rounded-pill border-0" onClick={() => active = !active} active={active}>
                            <FontAwesomeIcon className="text-danger" icon={faXmark} />
                        </Button>
                    </Col>
                </Row>
            </Container>
        </ListGroupItem>
    )
}