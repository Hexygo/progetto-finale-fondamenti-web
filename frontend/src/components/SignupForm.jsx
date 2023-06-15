import { useState } from "react"
import axios from 'axios'
import { redirect, useNavigate } from "react-router-dom"
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


export default function SignupForm(){
    const [username, setUsername]=useState("")
    const [password, setPassword]=useState("")
    const [cpassword, setCPassword]=useState("")
    const [show, setShow] = useState(false)
    const navigate=useNavigate()

    function handleSubmit(e){
        e.preventDefault()
        if(password==cpassword){            
            axios({
                method:'post',
                url:'http://localhost:3000/api/users/register',
                data:{
                    username:username,
                    password:password
                }
            }).then(data=>{
                if(data){
                    navigate("/home")
                }
            })
        }
        else    setShow(true)          
    }

    return (
        <>
            <Container className="position-absolute top-50 start-50 translate-middle">
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={3}></Col>
                        <Col md={6}>
                            <FloatingLabel label="Username" className="mb-3">
                                <Form.Control value={username} placeholder="Username" onChange={e=>setUsername(e.target.value)}/>
                            </FloatingLabel>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                    <Row>
                        <Col md={3}></Col>
                        <Col md={6}>
                            <FloatingLabel label="Password" className="mb-3">                
                                <Form.Control value={password} placeholder="Password" onChange={e=>setPassword(e.target.value)} type="password"/>
                            </FloatingLabel>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                    <Row>
                        <Col md={3}></Col>
                        <Col md={6}>
                            <FloatingLabel label="Conferma Password" className="mb-3">                
                                <Form.Control value={cpassword} placeholder="Password" onChange={e=>setCPassword(e.target.value)} type="password"/>
                            </FloatingLabel>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                    <Row>
                        <Col md={3}></Col>
                        <Col className="text-center mb-3" md={2}>
                            Già registrato?
                            <Button variant="link" type="button" 
                                onClick={   function goToLogin(e){
                                                e.preventDefault()
                                                navigate("/")
                                            }}>
                                Clicca qui!
                            </Button>
                        </Col>
                        <Col md={2}></Col>
                        <Col className="text-center mb-3 d-grid gap-2" md={2}>
                            <Button variant="outline-primary" size="small" type="submit">Sign Up</Button>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                </Form>              
                <Modal centered size="sm" show={show} onHide={function handleClose(){setShow(false)}}>
                    <Modal.Header>
                        <Modal.Title>Attenzione</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>Le password non coincidono!</Modal.Body>
                </Modal>  
            </Container>
        </>
    )
}