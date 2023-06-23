import SignUpForm from "../components/SignupForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp({setLoggedUser}){
    const navigate=useNavigate()
    useEffect(()=>{
        const session=localStorage.getItem('sessionID')
        if(session)
            navigate('/home')
    })
    return (
        <>
            <SignUpForm setLoggedUser={setLoggedUser} />
        </>
    )
}