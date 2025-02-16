import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import expenseOptions from '../data/expenseOptions.json';
import '../css/FormPage.css';


const PaymentForm = () => {
    const [form, setForm] = useState(createNewForm());
    const [paymentList, setPaymentList] = useState(() => {
        const storedPayments = localStorage.getItem('paymentList');
        return storedPayments ? JSON.parse(storedPayments) : [];
    });
    const [error, setError] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [razaoSocial, setRazaoSocial] = useState("");
    const [errorForm, setErrorForm] = useState("");


    // Função para criar um novo formulário vazio
    function createNewForm() {
        return {
            paymentDate: "",
            expense: "",
            amount: "",
            history: "",
            penalty: "",
            interest: "",
            competence: ""
        };
    }
    useEffect(() => {
        localStorage.setItem("paymentList", JSON.stringify(paymentList));
    }, [paymentList]);

    // Função para lidar com alterações nos campos do formulário
    const handleInputChange = (field, value) => {
        setForm({
            ...form,
            [field]: value,
        });
    };


    const ShareCSV = ({ csvContent }) => {

        // Função para compartilhar o arquivo
        const handleShare = async () => {
            if (!cnpj || !razaoSocial) {
                setErrorForm("CNPJ e Razão Social devem estar preenchidos.");
                return;
            } else {
                setErrorForm("")
            }
            try {
                // Criar um blob do conteúdo do CSV
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const fileName = cnpj + '-' + razaoSocial + '.csv';

                if (navigator.canShare && navigator.canShare({ files: [new File([blob], fileName)] })) {
                    const file = new File([blob], fileName, { type: 'text/csv' });


                    // Abrir o compartilhador nativo
                    await navigator.share({
                        title: 'Compartilhar CSV',
                        text: 'Segue o arquivo de pagamentos.',
                        files: [file],
                    });
                    console.log('Arquivo compartilhado com sucesso!');
                } else {
                    // Caso o navegador não suporte o compartilhamento de arquivos
                    alert('O recurso de compartilhamento não é suportado neste dispositivo ou navegador.');
                }
            } catch (error) {
                console.error('Erro ao compartilhar o arquivo:', error);
            }

        };

        return (
            <button
                onClick={handleShare}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    margin: '5px'
                }}
            >
                Compartilhar Arquivo
            </button>
        );
    };

    const DownloadCSV = ({ csvContent }) => {

        const handleDownload = () => {
            if (!cnpj || !razaoSocial) {
                setErrorForm("CNPJ e Razão Social devem estar preenchidos.");
                return;
            } else {
                setErrorForm("");
            }

            try {
                // Criar um blob do conteúdo do CSV
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const fileName = `${cnpj}-${razaoSocial}.csv`;

                // Criar link de download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Erro ao baixar o arquivo:', error);
            }
        };

        return (
            <button
                onClick={handleDownload}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Baixar Arquivo
            </button>
        );
    };

    // Função para salvar os dados
    const handleSave = () => {
        if (!form.paymentDate || !form.expense || !form.amount) {
            setError("Os campos Data do Pagamento, Despesa e Valor são obrigatórios.");
            return;
        }

        const selectedExpense = expenseOptions.find((opt) => opt.code === form.expense);
        if (!selectedExpense) {
            setError("A despesa selecionada não foi encontrada. Verifique o formulário.");
            return;
        }

        const newPayment = {
            ...form,
            paymentDate: form.paymentDate, // Salva a data exata sem conversão
            expense: {
                code: selectedExpense.code,
                name: selectedExpense.name,
            },
        };

        setPaymentList([...paymentList, newPayment]);
        setForm(createNewForm());
        setError("");
    };

    // Função para formatar valores em R$
    const formatCurrency = (value) => {
        value = value.replace(/[^\d]/g, ""); // Remove tudo que não é número
        const numericValue = parseInt(value, 10) || 0;
        const integerPart = Math.floor(numericValue / 100).toString();
        const decimalPart = (numericValue % 100).toString().padStart(2, "0");
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `${formattedInteger},${decimalPart}`;
    };

    // Função para deletar um pagamento da lista
    const handleDelete = (index) => {
        const updatedList = paymentList.filter((_, i) => i !== index);
        setPaymentList(updatedList);
    };

    const handleClearData = () => {
        if (window.confirm("Tem certeza que deseja limpar todos os pagamentos?")) {
            setPaymentList([]);
            localStorage.removeItem("paymentList");
            alert("Todos os pagamentos foram excluídos com sucesso!");
        } else {
            return
        }
    };

    // Função para gerar o conteúdo do CSV
    const generateCSVContent = () => {
        if (paymentList.length === 0) {
            return "Nenhum pagamento registrado.\n";
        }

        // Apenas os dados, sem cabeçalho
        const rows = paymentList.map(payment => {
            const amountWithoutThousands = payment.amount.replace(/\./g, "");
            const penaltyWithoutThousands = payment.penalty.replace(/\./g, "");
            const interestWithoutThousands = payment.interest.replace(/\./g, "");
            return [
                payment.paymentDate,
                payment.expense.code,
                amountWithoutThousands,
                payment.history,
                penaltyWithoutThousands,
                interestWithoutThousands,
                payment.competence ? `${payment.competence.substring(5, 7)}/${payment.competence.substring(0, 4)}` : ''
            ].join(";");
        });

        return '\uFEFF' + rows.join("\n");
    };

    // Retorno do JSX
    return (
        <div className="form-page-container">
            <div className='header-cadastro'>

                <img src="logocorv1.jpg" className="logo" alt="logo MA Contabil" />
                <nav><Link to='/' className="nav-button">Voltar para Home</Link></nav>
            </div>
            <h2 className="form-title">Cadastro de Pagamentos</h2>
            <div className="form-container">
                {/* Data do Pagamento */}
                <div className="form-group">
                    <label htmlFor="paymentDate">Data do Pagamento:</label>
                    <input
                        id="paymentDate"
                        type="date"
                        value={form.paymentDate}
                        onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                        required
                    />
                </div>

                {/* Despesa */}
                <div className="form-group">
                    <label htmlFor="expense">Despesa:</label>
                    <select
                        id="expense"
                        value={form.expense}
                        onChange={(e) => handleInputChange('expense', e.target.value)}
                        required
                    >
                        <option value="">Selecione</option>
                        {expenseOptions.map((option) => (
                            <option key={option.code} value={option.code}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Valor */}
                <div className="form-group">
                    <label htmlFor="amount">Valor (R$):</label>
                    <input
                        id="amount"
                        type="text"
                        value={form.amount}
                        onChange={(e) => handleInputChange('amount', formatCurrency(e.target.value))}
                        required
                    />
                </div>

                {/* Histórico */}
                <div className="form-group">
                    <label htmlFor="history">Histórico:</label>
                    <textarea
                        id="history"
                        maxLength="250"
                        style={{ width: "280px" }}
                        value={form.history}
                        onChange={(e) => handleInputChange('history', e.target.value)}
                    />
                </div>

                {/* Outros Campos */}
                <div className="form-group">
                    <label htmlFor="penalty">Valor da Multa (R$):</label>
                    <input
                        id="penalty"
                        type="text"
                        value={form.penalty}
                        onChange={(e) => handleInputChange('penalty', formatCurrency(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="interest">Valor Juros (R$):</label>
                    <input
                        id="interest"
                        type="text"
                        value={form.interest}
                        onChange={(e) => handleInputChange('interest', formatCurrency(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="competence">Competência:</label>
                    <input
                        id="competence"
                        type="month"
                        value={form.competence}
                        onChange={(e) => handleInputChange('competence', e.target.value)}
                    />
                </div>

            </div>

            {/* Exibe erro, se houver */}
            {error && <p className="error-message">{error}</p>}

            {/* Botão de salvar */}
            <div className="form-actions">
                <button className="save-button" onClick={handleSave}>Salvar</button>

            </div>

            {/* Lista de pagamentos salvos */}
            <h3 className="saved-payments-title">Pagamentos Salvos:</h3>
            {paymentList.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ color: '#555', marginRight: '10px' }}>Você tem pagamentos Salvos!</p>
                    <button
                        className="clear-button"
                        onClick={handleClearData}
                        style={{
                            padding: '10px 10px',
                            fontSize: '10px',
                            backgroundColor: '#FF6347',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            height: '30px',

                        }}
                    >Excluir Lista
                    </button>
                </div>
            )}

            <table className="payment-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Valor</th>
                        <th>Despesa</th>
                        <th>Multa Juros</th>
                        <th>Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentList.map((payment, i) => (
                        <tr key={i}>
                            <td>{payment.paymentDate.split('-').reverse().join('/')}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.expense.name}</td>
                            <td>{payment.penalty} - {payment.interest}</td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(i)}>
                                    <span role="img" aria-label="delete">❌</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Novo Formulário de CNPJ / Razão Social */}
            <h3>Informações da Empresa</h3>
            <div className="form-container">
                <div className="form-group">
                    <label htmlFor="cnpj">CNPJ / CPF:</label>
                    <input
                        id="cnpj"
                        type="text"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="razaoSocial">Razão Social / Nome:</label>
                    <input
                        id="razaoSocial"
                        type="text"
                        value={razaoSocial}
                        onChange={(e) => setRazaoSocial(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Erro de CNPJ e Razão Social */}
            {errorForm && <p className="error-message">{errorForm}</p>}

            {/* Botão Compartilhar */}
            <div className="form-actions">
                <h3>Compartilhar Arquivo CSV</h3>
                <ShareCSV csvContent={generateCSVContent()} />
                <DownloadCSV csvContent={generateCSVContent()} />
            </div>
        </div>
    );
};

export default PaymentForm;
