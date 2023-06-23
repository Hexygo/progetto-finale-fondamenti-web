import { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

export default function Login({setLoggedUser}){
    const navigate=useNavigate()
    useEffect(()=>{
        const session=localStorage.getItem('sessionID')
        if(session)
            navigate('/home')
    })

    return (
        <>
            <LoginForm setLoggedUser={setLoggedUser}/>
        </>
    )
}