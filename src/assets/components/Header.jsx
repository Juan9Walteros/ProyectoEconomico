import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
  return (
    <Navbar expand="lg" fixed="top" className="Header">
      <Container className='d-flex justify-content-center'>
        <Navbar.Brand href="#">
          <img
            alt="Logo"
            src="/cartera.png" // asegúrate de que el logo esté en public/img/
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          SmartVaoult
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;