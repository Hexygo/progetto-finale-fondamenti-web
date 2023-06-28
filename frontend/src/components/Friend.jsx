import ListGroup from 'react-bootstrap/ListGroup'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Friend({user, setFriendSelected, connected}){

    const handleClick=()=>{
        setFriendSelected(user)
    }

    //Aggiungere pulsante per rimuovere amico
    //Aggiungere badge di notifica, con numero di messaggi non letti da parte dell'utente
    
    return(
        <ListGroup.Item variant='dark' action href={user.userID} as='li' eventKey={user.userID} onClick={handleClick}>
            <h5 className='d-flex'>
                {user.username}
            </h5>
            <blockquote>
                {connected ?
                    <><FontAwesomeIcon className="text-success" icon={faCircle}/> online</>:
                    <><FontAwesomeIcon className="text-secondary"icon={faCircle}/> offline</>}
            </blockquote>
        </ListGroup.Item>
    )
}