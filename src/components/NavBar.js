import React from 'react'
import { Link } from 'react-router-dom';
import '../css/App.css';

function NavBar() {
  return (
    <section className="header">
      <h1>MA CONTABIL</h1>
      <nav>
        <Link to="/" className="nav-button">Home</Link>
        <Link to="/pagamentos" className="nav-button">Pagamentos</Link>
      </nav>
    </section>
  );
}

export default NavBar