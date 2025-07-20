import React from 'react'
import { Link } from 'react-router-dom';
import '../css/App.css';

function NavBar() {
  return (

    <section className="header">

      <img src="9.png" alt="MA Contabil" className="logo" />
      <h1>CONTABIL</h1>
      <p className="slogan">Sua contabilidade transparente e eficiente</p>

      <nav >
        <Link to="/pagamentos" className="nav-button">Pagamentos</Link>
      </nav>
    </section>

  );
}

export default NavBar