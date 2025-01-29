import React from 'react';
import '../css/App.css';

function Services() {
  return (
    <section className="services">
      <h2>Nossos Serviços</h2>
      <div className="service-lists">
        <ul className="service-list">
          <li>Consultoria Financeira</li>
          <li>Gestão de Negócios</li>
          <li>Planejamento Tributário</li>
        </ul>
        <ul className="service-list">
          <li>Auditoria Contábil</li>
          <li>Serviços de Compliance</li>
          <li>Relatórios Personalizados</li>
        </ul>
      </div>
    </section>
  );
}

export default Services;