import React from 'react';
import '../css/Services.css';

function Services() {
  return (
    <div className="services-container" id="Services">
      <h2 > Nossos Serviços</h2>
      <div className="services">
        <div className="service-card">
          <h4>Consultoria Contábil</h4>
          <p>Suporte completo e personalizado para sua empresa.</p>
        </div>
        <div className="service-card">
          <h4>Planejamento Tributário</h4>
          <p>Estratégias para reduzir custos e otimizar resultados.</p>
        </div>
        <div className="service-card">
          <h4>Auditoria</h4>
          <p>Verificação detalhada para garantir a saúde financeira.</p>
        </div>
      </div>
    </div>
  );
}

export default Services;
