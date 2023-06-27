import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
export default function Message({user, el}){
    return(
        <>
        <Row className="m-2">
            <Col md={(user.username===el.sender.username)? {span:5,offset:7} : 5 } className= {(user.username===el.sender.username)? "d-flex justify-content-end" : "d-flex justify-content-start"}>
                <Card style={{minWidth:'100px', width:'fit-content', backgroundColor:(user.username===el.sender.username)?'#9ACBAE':'#BF9DCB', color:'#212529' }} className='rounded-4'>
                    <Card.Body className='py-2'>
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