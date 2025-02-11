import React from 'react';
import '../css/NavBar.css';

function NavBar() {
  return (
    <nav className="nav-bar">
      <div className="logo">
        <a href="#home">
          <img src="logo_brancav1.png" alt="MaContabil Logo" />
        </a>
      </div>
      <h1 className="nav-title">M A CONTABIL</h1>
      <ul className="nav-links">
        <li>
          <a href="#Services">Serviços</a>
        </li>
        <li>
          <a href="#Contact">Contato</a>
        </li>
        <li>
          <a href="/pagamentos">Pagamentos</a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
