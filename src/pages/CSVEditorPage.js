import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import expenseOptions from '../data/expenseOptions.json';
import '../css/FormPage.css';

const CSVEditorPage = () => {
    const [csvInput, setCsvInput] = useState('');
    const [paymentList, setPaymentList] = useState([]);
    const [error, setError] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [cnpj, setCnpj] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');

    // Função para importar arquivo CSV
    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            setError('Por favor, selecione um arquivo CSV');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            setCsvInput(content);
            // Parsea automaticamente após carregar
            parseCSVContent(content);
        };
        reader.onerror = () => {
            setError('Erro ao ler o arquivo');
        };
        reader.readAsText(file, 'UTF-8');
    };

    // Função para parsear CSV
    const parseCSV = () => {
        parseCSVContent(csvInput);
    };

    const parseCSVContent = (content) => {
        try {
            setError('');
            const lines = content.trim().split('\n');

            if (lines.length === 0 || !content.trim()) {
                setError('Cole um CSV válido');
                return;
            }

            const payments = lines.map((line, index) => {
                // Remove BOM se existir
                const cleanLine = line.replace(/^\uFEFF/, '');
                const fields = cleanLine.split(';');

                if (fields.length !== 7) {
                    throw new Error(`Linha ${index + 1}: formato inválido (esperado 7 campos)`);
                }

                const [date, code, amount, history, penalty, interest, competence] = fields;

                // Validar código
                const expense = expenseOptions.find(opt => opt.code === code);
                if (!expense) {
                    throw new Error(`Linha ${index + 1}: código de despesa inválido (${code})`);
                }

                // Converter data de DD/MM/AAAA para AAAA-MM-DD
                const [day, month, year] = date.split('/');
                const paymentDate = `${year}-${month}-${day}`;

                // Extrair competência
                let competenceMonth = '';
                let competenceYear = '';
                if (competence && competence.trim()) {
                    const [compMonth, compYear] = competence.split('/');
                    competenceMonth = compMonth;
                    competenceYear = compYear;
                }

                return {
                    paymentDate,
                    expense: {
                        code: expense.code,
                        name: expense.name
                    },
                    amount: amount || '0,00',
                    history: history || '',
                    penalty: penalty || '0,00',
                    interest: interest || '0,00',
                    competenceMonth,
                    competenceYear
                };
            });

            setPaymentList(payments);
            setCsvInput(''); // Limpa o textarea após parsear
        } catch (err) {
            setError(err.message);
        }
    };

    // Função para editar um item
    const handleEdit = (index) => {
        const payment = paymentList[index];
        setEditForm({ ...payment, index });
        setEditingIndex(index);
    };

    // Função para salvar edição
    const handleSaveEdit = () => {
        if (!editForm.paymentDate || !editForm.expense.code || !editForm.amount) {
            setError('Data, Despesa e Valor são obrigatórios');
            return;
        }

        const updatedList = [...paymentList];
        updatedList[editingIndex] = {
            ...editForm
        };
        setPaymentList(updatedList);
        setEditingIndex(null);
        setEditForm(null);
        setError('');
    };

    // Função para cancelar edição
    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditForm(null);
        setError('');
    };

    // Função para deletar
    const handleDelete = (index) => {
        if (window.confirm('Deseja excluir este pagamento?')) {
            const updatedList = paymentList.filter((_, i) => i !== index);
            setPaymentList(updatedList);
            if (editingIndex === index) {
                handleCancelEdit();
            }
        }
    };

    // Função para gerar CSV
    const generateCSV = () => {
        const rows = paymentList.map(payment => {
            const dateFormatted = payment.paymentDate.split('-').reverse().join('/');
            const amountWithoutThousands = payment.amount.replace(/\./g, '');
            const penaltyWithoutThousands = payment.penalty ? payment.penalty.replace(/\./g, '') : '';
            const interestWithoutThousands = payment.interest ? payment.interest.replace(/\./g, '') : '';
            const competence = payment.competenceMonth && payment.competenceYear
                ? `${payment.competenceMonth}/${payment.competenceYear}`
                : '';

            return [
                dateFormatted,
                payment.expense.code,
                amountWithoutThousands,
                payment.history || '',
                penaltyWithoutThousands,
                interestWithoutThousands,
                competence
            ].join(';');
        });

        return '\uFEFF' + rows.join('\n');
    };

    // Função para baixar CSV
    const handleDownload = () => {
        if (paymentList.length === 0) {
            setError('Não há pagamentos para exportar');
            return;
        }

        if (!cnpj || !razaoSocial) {
            setError('CNPJ e Razão Social são obrigatórios para download');
            return;
        }

        try {
            const csvContent = generateCSV();
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const fileName = `${cnpj}-${razaoSocial}.csv`;

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setError('');
        } catch (error) {
            console.error('Erro ao baixar o arquivo:', error);
            setError('Erro ao gerar o arquivo');
        }
    };

    const formatCurrency = (value) => {
        value = value.replace(/[^\d]/g, '');
        const numericValue = parseInt(value, 10) || 0;
        const integerPart = Math.floor(numericValue / 100).toString();
        const decimalPart = (numericValue % 100).toString().padStart(2, '0');
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${formattedInteger},${decimalPart}`;
    };

    return (
        <div className="form-page-container">
            <div className='header-cadastro'>
                <img src="9.png" className="logo" alt="logo MA Contabil" />
                <nav>
                    <Link to='/' className="nav-button">Home</Link>
                    <Link to='/pagamentos' className="nav-button">Cadastro</Link>
                </nav>
            </div>

            <h2 className="form-title">Editor de CSV</h2>

            {paymentList.length === 0 ? (
                <div>
                    <div style={{
                        padding: '20px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '15px', 
                            fontWeight: '600', 
                            color: 'var(--primary-color)',
                            fontSize: '16px'
                        }}>
                            📁 Importar Arquivo CSV
                        </label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileImport}
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '14px',
                                border: '2px dashed var(--secondary-color)',
                                borderRadius: '8px',
                                backgroundColor: '#f9f9f9',
                                cursor: 'pointer',
                                marginBottom: '20px'
                            }}
                        />
                        
                        <div style={{
                            textAlign: 'center',
                            margin: '20px 0',
                            color: '#999',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            - OU -
                        </div>

                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'var(--primary-color)' }}>
                            Cole o conteúdo do CSV aqui:
                        </label>
                        <textarea
                            value={csvInput}
                            onChange={(e) => setCsvInput(e.target.value)}
                            placeholder="Cole o conteúdo do CSV aqui...&#10;Exemplo:&#10;06/01/2026;P10.01.00001;1000,00;Descrição;;;"
                            style={{
                                width: '100%',
                                minHeight: '150px',
                                padding: '12px',
                                fontSize: '14px',
                                border: '2px solid var(--secondary-color)',
                                borderRadius: '8px',
                                fontFamily: 'monospace',
                                resize: 'vertical'
                            }}
                        />
                        {error && <p className="error-message">{error}</p>}
                        <button
                            onClick={parseCSV}
                            className="save-button"
                            style={{ marginTop: '15px' }}
                        >
                            📊 Carregar CSV
                        </button>
                    </div>

                    <div style={{
                        padding: '20px',
                        backgroundColor: '#E8F5E9',
                        borderRadius: '8px',
                        border: '2px solid var(--success-color)'
                    }}>
                        <h3 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>ℹ️ Formato esperado:</h3>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                            Cada linha deve ter 7 campos separados por ponto e vírgula (;):
                        </p>
                        <ol style={{ fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
                            <li>Data (DD/MM/AAAA)</li>
                            <li>Código da despesa</li>
                            <li>Valor (sem separador de milhares)</li>
                            <li>Histórico</li>
                            <li>Multa (pode ficar vazio)</li>
                            <li>Juros (pode ficar vazio)</li>
                            <li>Competência MM/AAAA (obrigatório apenas para Previdência e Imposto Pago)</li>
                        </ol>
                    </div>
                </div>
            ) : (
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <p style={{ color: 'var(--success-color)', fontWeight: '600', margin: 0 }}>
                            ✓ {paymentList.length} pagamento(s) carregado(s)
                        </p>
                        <button
                            onClick={() => {
                                if (window.confirm('Deseja limpar todos os dados e carregar um novo CSV?')) {
                                    setPaymentList([]);
                                    setEditingIndex(null);
                                    setEditForm(null);
                                }
                            }}
                            className="clear-button"
                        >
                            Novo CSV
                        </button>
                    </div>

                    {/* Formulário de edição */}
                    {editingIndex !== null && editForm && (
                        <div className="form-container" style={{ marginBottom: '20px' }}>
                            <h3 style={{ width: '100%', color: 'var(--primary-color)' }}>
                                ✏️ Editando pagamento #{editingIndex + 1}
                            </h3>

                            <div className="form-group">
                                <label>Data do Pagamento:</label>
                                <input
                                    type="date"
                                    value={editForm.paymentDate}
                                    onChange={(e) => setEditForm({ ...editForm, paymentDate: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Despesa:</label>
                                <select
                                    value={editForm.expense.code}
                                    onChange={(e) => {
                                        const expense = expenseOptions.find(opt => opt.code === e.target.value);
                                        setEditForm({
                                            ...editForm,
                                            expense: { code: expense.code, name: expense.name }
                                        });
                                    }}
                                >
                                    {expenseOptions.map((option) => (
                                        <option key={option.code} value={option.code}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Valor (R$):</label>
                                <input
                                    type="text"
                                    value={editForm.amount}
                                    onChange={(e) => setEditForm({ ...editForm, amount: formatCurrency(e.target.value) })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Histórico:</label>
                                <textarea
                                    maxLength="250"
                                    value={editForm.history}
                                    onChange={(e) => setEditForm({ ...editForm, history: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Multa (R$):</label>
                                <input
                                    type="text"
                                    value={editForm.penalty}
                                    onChange={(e) => setEditForm({ ...editForm, penalty: formatCurrency(e.target.value) })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Juros (R$):</label>
                                <input
                                    type="text"
                                    value={editForm.interest}
                                    onChange={(e) => setEditForm({ ...editForm, interest: formatCurrency(e.target.value) })}
                                />
                            </div>

                            <div className="form-group" style={{ flex: '1 1 100%' }}>
                                <label>Competência:</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        value={editForm.competenceMonth}
                                        onChange={(e) => setEditForm({ ...editForm, competenceMonth: e.target.value })}
                                    >
                                        <option value="">Mês</option>
                                        {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={editForm.competenceYear}
                                        onChange={(e) => setEditForm({ ...editForm, competenceYear: e.target.value })}
                                    >
                                        <option value="">Ano</option>
                                        {Array.from({ length: 10 }, (_, i) => {
                                            const year = new Date().getFullYear() - 5 + i;
                                            return <option key={year} value={year}>{year}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>

                            {error && <p className="error-message" style={{ width: '100%' }}>{error}</p>}

                            <div className="form-actions" style={{ width: '100%', marginTop: '10px' }}>
                                <button className="save-button" onClick={handleSaveEdit}>
                                    ✓ Salvar
                                </button>
                                <button className="cancel-button" onClick={handleCancelEdit}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tabela de pagamentos */}
                    <table className="payment-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Data</th>
                                <th>Valor</th>
                                <th>Despesa</th>
                                <th>Multa/Juros</th>
                                <th>Competência</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentList.map((payment, i) => (
                                <tr key={i} style={editingIndex === i ? { backgroundColor: '#FFF3CD' } : {}}>
                                    <td>{i + 1}</td>
                                    <td>{payment.paymentDate.split('-').reverse().join('/')}</td>
                                    <td>{payment.amount}</td>
                                    <td>{payment.expense.name}</td>
                                    <td>{payment.penalty} / {payment.interest}</td>
                                    <td>
                                        {payment.competenceMonth && payment.competenceYear
                                            ? `${payment.competenceMonth}/${payment.competenceYear}`
                                            : '-'}
                                    </td>
                                    <td style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                        <button
                                            className="edit-button"
                                            onClick={() => handleEdit(i)}
                                            disabled={editingIndex !== null && editingIndex !== i}
                                        >
                                            <span role="img" aria-label="edit">✏️</span>
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(i)}
                                        >
                                            <span role="img" aria-label="delete">❌</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Informações da empresa e download */}
                    <div style={{ marginTop: '30px' }}>
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

                        {error && <p className="error-message">{error}</p>}

                        <div className="form-actions">
                            <h3>Baixar CSV Editado</h3>
                            <button
                                onClick={handleDownload}
                                className="download-button"
                            >
                                💾 Baixar Arquivo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CSVEditorPage;
