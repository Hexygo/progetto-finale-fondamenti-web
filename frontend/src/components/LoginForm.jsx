import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

export default function LoginForm(){
    const [username, setUsername]=useState("")
    const [password, setPassword]=useState("")
    const navigate=useNavigate()

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
        <form
            onSubmit={handleSubmit}>
            <input value={username} onChange={e=>setUsername(e.target.value)}/>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password"/>
            <button type="submit">Log In</button>
        </form>
    )
}