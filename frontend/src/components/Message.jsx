import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
export default function Message({user, el}){
    return(
        <>
        <Row className="m-2">
            <Col md={(user.username===el.sender.username)? {span:4,offset:8} : 4 } >
                <Card border={(user.username===el.sender.username)? "primary" : "info"}>
                    <Card.Body>
                        <Card.Text className='mb-0'>
                            {el.content}                                
                        </Card.Text> 
                        <Card.Text className='mb-0 text-end'>            
                            <small>{new Date(el.time).toLocaleTimeString('it-IT').substring(0,5)}</small>
                        </Card.Text>                       
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        </>
    )
}