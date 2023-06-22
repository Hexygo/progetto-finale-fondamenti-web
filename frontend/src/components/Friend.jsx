import ListGroup from 'react-bootstrap/ListGroup'

export default function Friend({user, setFriendSelected}){

    const handleClick=()=>{
        setFriendSelected(user)
    }
    
    return(
        <ListGroup.Item variant='dark' action href={user.userID} as='li' eventKey={user.userID} onClick={handleClick}>Username{user.self?"(You)":""}: {user.user.username}{user.connected?'(online)':'(offline)'}</ListGroup.Item>
    )
}