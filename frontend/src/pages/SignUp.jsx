import SignUpForm from "../components/SignupForm";

export default function SignUp({setLoggedUser}){
    return (
        <>
            <SignUpForm setLoggedUser={setLoggedUser} />
        </>
    )
}