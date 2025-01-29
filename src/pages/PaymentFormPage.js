import React from 'react';
import '../css/FormPage.css'; // Arquivo CSS para estilos específicos do formulário
import PaymentForm from '../components/PaymentForm'; // Importa o componente de formulário

function PaymentFormPage() {
    return (
        <div className="form-page-container">
            <PaymentForm />
        </div>
    );
}

export default PaymentFormPage;

