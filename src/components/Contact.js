import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import '../css/Contact.css';

const Contact = () => {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            form.current,
            'YOUR_PUBLIC_KEY'
        )
            .then((result) => {
                console.log('Email enviado com sucesso:', result.text);
                alert('Mensagem enviada! Entraremos em contato em breve.');
                form.current.reset();
            }, (error) => {
                console.error('Erro ao enviar o email:', error.text);
                alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
            });
    };

    return (
        <div className="contact-container" id="Contact">
            <div className="contact-info">
                <h2>Entre em Contato Conosco!</h2>
                <p>Estamos à disposição para atender às suas necessidades contábeis. Ligue para (21) 3344-3434 ou envie uma mensagem pelo WhatsApp.</p>
                <a
                    href="https://wa.me/5521964580136"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-link"
                >
                    <img src="whatsapp.png" alt="WhatsApp" className="whats-img" /> Conversar no WhatsApp
                </a>
            </div>
            <div className="contact-form">
                <h3>Envie uma Mensagem</h3>
                <form ref={form} onSubmit={sendEmail}>
                    <label htmlFor="user_name">Nome:</label>
                    <input type="text" id="user_name" name="user_name" required />

                    <label htmlFor="user_phone">Telefone:</label>
                    <input type="tel" id="user_phone" name="user_phone" required />

                    <label htmlFor="message">Mensagem:</label>
                    <textarea id="message" name="message" rows="5" required></textarea>

                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
