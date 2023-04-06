import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const TitleHeader = () => {
    return (
        <>
            <Navbar bg="dark" variant="dark" className='m-0'>
                <Container>
                    <Navbar.Brand href="#home"><strong>CineHub</strong></Navbar.Brand>
                    {/* <Nav className="me-auto">
                        <Nav.Link  href="/Register">Sign up</Nav.Link>
                    </Nav>
                    <Nav className="me-auto">
                        <Nav.Link href="/Login">Sign in</Nav.Link>
                    </Nav> */}
                    <Nav className="ml-auto">
                        <Nav.Link href="/Register">Sign up</Nav.Link>
                        <Nav.Link disabled>|</Nav.Link>
                        <Nav.Link href="/Login">Sign in</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default TitleHeader