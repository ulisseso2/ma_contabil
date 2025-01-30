import React from 'react'
import { Link } from 'react-router-dom';
import '../css/App.css';

function NavBar() {
  return (

    <section className="header">

      <img src="logo_brancav1.png" alt="Imagem ilustrativa" className="logo" />
      <h1>M A CONTABIL</h1>


      <nav >
        <Link to="/pagamentos" className="nav-button">Pagamentos</Link>
      </nav>
    </section>

  );
}

export default NavBar