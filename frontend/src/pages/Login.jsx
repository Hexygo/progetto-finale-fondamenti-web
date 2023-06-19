import LoginForm from "../components/LoginForm";

export default function Login({setLoggedUser}){
    return (
        <>
            <LoginForm setLoggedUser={setLoggedUser}/>
        </>
    )
}