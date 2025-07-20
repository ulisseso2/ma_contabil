import React from 'react';
import '../css/App.css';
import servicesData from '../data/servicesData'; // Importa os dados dos serviços

function Services() {
  return (
    <section className="services">
      <h2>Nossos Serviços</h2>
      <div className="services-grid"> {/* Nova div para o grid */}
        {servicesData.map(service => (
          <div className="service-card" key={service.id}> {/* Card individual de serviço */}
            <div className="service-icon">
              {service.icon} {/* Renderiza o ícone */}
            </div>
            <h3>{service.title}</h3> {/* Título do serviço */}
            <p>{service.description}</p> {/* Descrição do serviço */}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;