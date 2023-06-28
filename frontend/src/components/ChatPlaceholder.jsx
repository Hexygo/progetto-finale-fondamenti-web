import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default function ChatPlaceholder(){
    return(
        <Container className="vh-100 position-relative py-4" >
            <Row className="border rounded d-flex justify-content-center align-items-center" style={{height:'calc(80vh + 50px)'}} >
                <div className="text-center">
                    <figure className="figure">
                        <img className="figure-img img-fluid" src="/waiting.png" alt="Pigeon delivering a letter" style={{width:'50%'}}/>
                        <figcaption>
                        <p className="display-3"style={{fontFamily:'Roboto Condensed, sans-serif'}}>PigeComm</p>
                    <blockquote className="blockquote">
                        Seleziona una chat dal menu al lato per iniziare a chattare.
                    </blockquote>
                        </figcaption>
                        </figure>
                </div>
            </Row>
        </Container>
    )
}