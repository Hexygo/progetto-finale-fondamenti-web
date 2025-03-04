import { useState } from "react"
import axiosInstance from '../axios'
import socket from "../socket";
import { useNavigate } from "react-router-dom"
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { sha256 } from 'js-sha256';


export default function SignupForm({setLoggedUser}){
    const [username, setUsername]=useState("")
    const [password, setPassword]=useState("")
    const [cpassword, setCPassword]=useState("")
    const [show, setShow] = useState(true)
    const navigate=useNavigate()
    const[pwd, setpwd]= useState(false);
    const[pwd2, setpwd2]= useState(false);  
    const [modal, setModal] = useState(false)
    
    function handleSubmit(e){
        e.preventDefault() 
        if (username!=='' && password!=='' && cpassword!=='') {
            axiosInstance({
                method:'post',
                url:'/api/users/register',
                data:{
                    username:username,
                    password:sha256(password)
                }
            }).then(data=>{
                if(data){
                    setLoggedUser(data.data)
                    const cookieToken = document.cookie
                        .split("; ")
                        .find((row) => row.startsWith("session_token="))
                        ?.split("=")[1]
                    const sessionID = cookieToken
                    if (sessionID) {
                        socket.auth = { sessionID: sessionID }
                    } else
                        socket.auth = { userID: data.data._id }

                    socket.connect()
                    localStorage.setItem('sessionID', sessionID)
                    navigate("/home")
                }
            }).catch((err)=>{   //Utente già creato su DB, prompt al login
                console.warn(err)
                setModal(true)
            })
        }
    }

    function check(p1,p2){
        if(p1!==p2){ 
            setShow(false)
        }   
        else
            setShow(true)  
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
                            <InputGroup>
                                <FloatingLabel label="Password" className="mb-3">                
                                    <Form.Control value={password} placeholder="Password" onChange={e=>{setPassword(e.target.value); check(e.target.value, cpassword)}} type={(pwd) ? "text" : "password"}/>
                                </FloatingLabel>   
                                <Button style={{width: "50px"}} variant="dark"className="mb-3" size="large" onClick={function swap(){setpwd(!pwd)}}><FontAwesomeIcon  icon={(pwd) ? faEye : faEyeSlash} id="togglePassword"></FontAwesomeIcon></Button> 
                            </InputGroup>                        
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                    <Row>
                        <Col md={3}></Col>
                        <Col md={6}>
                            <InputGroup>
                                <FloatingLabel label="Conferma Password" className="mb-3">                
                                    <Form.Control value={cpassword} placeholder="Password" onChange={e=>{setCPassword(e.target.value); check(password, e.target.value)}} type={(pwd2) ? "text" : "password"}/>
                                </FloatingLabel>
                                <Button style={{width: "50px"}} variant="dark" className="mb-3" size="large" onClick={function swap(){setpwd2(!pwd2)}}><FontAwesomeIcon  icon={(pwd2) ? faEye : faEyeSlash} id="togglePassword"></FontAwesomeIcon></Button>  
                            </InputGroup>
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
                            <Button variant="outline-primary" size="small" type="submit" disabled={username==='' || password==='' || !show}><h5>Sign Up</h5></Button>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                    <Row className={(show) ? "invisible":"visible"}>
                        <Col md={3}></Col>
                        <Col md={6}>
                            <Alert variant="danger">
                                <Alert.Heading>Attenzione</Alert.Heading>
                                <p>Le due password non coincidono</p>
                            </Alert>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                </Form>                
            </Container>   
            <Modal centered show={modal} onHide={function modal(){setModal(false)}}> 
                    <Modal.Header >
                        <Modal.Title>Username già in uso</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Se stai cercando di fare il login
                        <Button variant="link" type="button" 
                            onClick={   function goToLogin(e){
                                            e.preventDefault()
                                            navigate("/")
                                        }}>
                            clicca qui!
                        </Button>
                    </Modal.Body>
                </Modal>         
        </>        
    )
}