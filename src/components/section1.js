import React from 'react';
import '../css/Section1.css';

function Section1() {
  return (
    <section className="section1">
      <div className="hero-content">
        <h1>Somos a M A Contabil</h1>
        <p>
          Mais do que um escritório de contabilidade, somos seus parceiros estratégicos.
          Oferecemos soluções personalizadas para garantir o sucesso do seu negócio, com transparência e compromisso. <br /><br />
          Nosso propósito é simplificar a gestão contábil, ajudando empresas a superar desafios fiscais e aproveitar oportunidades.
          Com expertise e proximidade, crescemos juntos com nossos clientes. <br /><br />
          Com uma equipe experiente e apaixonada pelo que faz, proporcionamos segurança financeira e gestão inteligente para empreendedores de todos os portes.
        </p>
      </div>
      <div className="image-container">
        <img src="imagem_contabilista.jpg" alt="Imagem ilustrativa" className="image" />
      </div>
    </section>
  );
}

export default Section1;
