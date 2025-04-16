import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
  return (
    <Navbar expand="lg" fixed="top" className="Header">
      <Container>
        <Navbar.Brand href="#">
          <img
            alt=""
            src="/img/logo.svg" // asegúrate de que el logo esté en public/img/
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Empresa Económica
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;