import React from 'react';
import '../css/App.css';
import { BsWhatsapp } from 'react-icons/bs';

function Section1() {
  return (
    <section className="section1">
      <div className="text-content">
        <h1>Simplificando a Contabilidade para o Sucesso do Seu Negócio</h1>
        <p>Mais do que um escritório de contabilidade, somos seus parceiros estratégicos. Oferecemos soluções personalizadas para garantir o sucesso do seu negócio, com transparência e compromisso. <br />  <br /> Nosso propósito é simplificar a gestão contábil, ajudando empresas a superar desafios fiscais e aproveitar oportunidades. Com expertise e proximidade, crescemos juntos com nossos clientes. <br /> <br />  Com uma equipe experiente e apaixonada pelo que faz, proporcionamos segurança financeira e gestão inteligente para empreendedores de todos os portes.</p>

        <a
          href="https://wa.me/5521964580136?text=Olá, gostaria de mais informações sobre os serviços da MA Contabil."
          target="_blank"
          rel="noopener noreferrer"
          className="primary-cta-button whatsapp-cta-button" // Adicione classes para estilização
        >
          <BsWhatsapp style={{ marginRight: '10px', verticalAlign: 'middle' }} /> {/* Ícone do WhatsApp */}
          Fale Conosco
        </a>

      </div>
      <img src="imagem_contabilista.jpg" alt="Imagem ilustrativa" className="image" />
    </section>
  );
}
export default Section1