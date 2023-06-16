import { useState } from "react"
import axios from 'axios'
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


export default function LoginForm(){
    const [username, setUsername]=useState("")
    const [password, setPassword]=useState("")
    const navigate=useNavigate()
    const[pwd, setpwd]= useState(false);

    function handleSubmit(e){
        e.preventDefault()
        axios({
            method:'post',
            url:'http://localhost:3000/api/users/login',
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
                                    <Form.Control value={password} placeholder="Password" onChange={e=>setPassword(e.target.value)} type={(pwd) ? "text" : "password"}/>
                                </FloatingLabel>
                                <Button style={{width: "50px"}} variant="dark" className="mb-3" size="large" onClick={function swap(){setpwd(!pwd)}}><FontAwesomeIcon  icon={(pwd) ? faEye : faEyeSlash} id="togglePassword"></FontAwesomeIcon></Button> 
                            </InputGroup>
                        </Col>
                        <Col md={3}></Col>
                    </Row>                    
                    <Row>
                        <Col md={3}></Col>
                        <Col className="text-center mb-3" md={2}>
                            Non hai un account?
                            <Button variant="link" type="button" 
                                onClick={   function goToSignup(e){
                                                e.preventDefault()
                                                navigate("/signup")
                                            }}>
                                Clicca qui!
                            </Button>
                        </Col>
                        <Col md={2}></Col>
                        <Col className="text-center mb-3 d-grid gap-2" md={2}>
                            <Button variant="outline-primary" size="small" type="submit"><h5>Log in</h5></Button>
                        </Col>
                        <Col md={3}></Col>
                    </Row>
                </Form>                
            </Container>
        </>
    )
}