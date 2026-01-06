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
    const [editingIndex, setEditingIndex] = useState(null); // Índice do item sendo editado
    const [expenseSearch, setExpenseSearch] = useState(""); // Busca de despesas

    // Ordenar despesas alfabeticamente
    const sortedExpenseOptions = [...expenseOptions].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR')
    );

    // Filtrar despesas com base na busca
    const filteredExpenses = sortedExpenseOptions.filter(option =>
        option.name.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        option.code.toLowerCase().includes(expenseSearch.toLowerCase())
    );

    // Verificar se a despesa selecionada requer competência
    const requiresCompetence = (expenseCode) => {
        return expenseCode === 'P20.01.00001' || expenseCode === 'P20.01.00004';
    };

    // Função para criar um novo formulário vazio
    function createNewForm() {
        return {
            paymentDate: "",
            expense: "",
            amount: "",
            history: "",
            penalty: "",
            interest: "",
            competenceMonth: "",
            competenceYear: ""
        };
    }
    useEffect(() => {
        localStorage.setItem("paymentList", JSON.stringify(paymentList));
    }, [paymentList]);

    // Função para lidar com alterações nos campos do formulário
    const handleInputChange = (field, value) => {
        // Se mudou a despesa e a nova não requer competência, limpa os campos
        if (field === 'expense' && !requiresCompetence(value)) {
            setForm({
                ...form,
                [field]: value,
                competenceMonth: "",
                competenceYear: ""
            });
        } else {
            setForm({
                ...form,
                [field]: value,
            });
        }
    };

    // Função para preencher competência com o mês anterior
    const fillPreviousMonth = () => {
        const today = new Date();
        const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const year = previousMonth.getFullYear().toString();
        const month = String(previousMonth.getMonth() + 1).padStart(2, '0');
        setForm({
            ...form,
            competenceMonth: month,
            competenceYear: year
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

                    // Perguntar se deseja limpar a lista após compartilhamento
                    if (window.confirm('Arquivo compartilhado com sucesso! Deseja limpar a lista de pagamentos?')) {
                        setPaymentList([]);
                        localStorage.removeItem('paymentList');
                    }
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
                className="share-button"
            >
                📤 Compartilhar Arquivo
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

                // Perguntar se deseja limpar a lista após download
                setTimeout(() => {
                    if (window.confirm('Arquivo baixado com sucesso! Deseja limpar a lista de pagamentos?')) {
                        setPaymentList([]);
                        localStorage.removeItem('paymentList');
                    }
                }, 500);
            } catch (error) {
                console.error('Erro ao baixar o arquivo:', error);
            }
        };

        return (
            <button
                onClick={handleDownload}
                className="download-button"
            >
                💾 Baixar Arquivo
            </button>
        );
    };

    // Função para salvar os dados
    const handleSave = () => {
        if (!form.paymentDate || !form.expense || !form.amount) {
            setError("Os campos Data do Pagamento, Despesa e Valor são obrigatórios.");
            return;
        }

        // Validar competência para despesas que exigem
        if (requiresCompetence(form.expense)) {
            if (!form.competenceMonth || !form.competenceYear) {
                setError("Competência é obrigatória para Previdência Oficial e Imposto Pago.");
                return;
            }
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

        if (editingIndex !== null) {
            // Modo de edição: atualiza o item existente
            const updatedList = [...paymentList];
            updatedList[editingIndex] = newPayment;
            setPaymentList(updatedList);
            setEditingIndex(null);
        } else {
            // Modo de adição: adiciona novo item
            setPaymentList([...paymentList, newPayment]);
        }

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

    // Função para editar um pagamento da lista
    const handleEdit = (index) => {
        const payment = paymentList[index];
        setForm({
            paymentDate: payment.paymentDate,
            expense: payment.expense.code,
            amount: payment.amount,
            history: payment.history,
            penalty: payment.penalty,
            interest: payment.interest,
            competenceMonth: payment.competenceMonth,
            competenceYear: payment.competenceYear
        });
        setEditingIndex(index);
        setError("");
        // Rolar para o topo do formulário
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Função para cancelar edição
    const handleCancelEdit = () => {
        setForm(createNewForm());
        setEditingIndex(null);
        setError("");
    };

    // Função para deletar um pagamento da lista
    const handleDelete = (index) => {
        if (editingIndex === index) {
            handleCancelEdit();
        }
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

    // Função para gerar o conteúdo do CSV no formato do Carnê Leão
    const generateCSVContent = () => {
        if (paymentList.length === 0) {
            return "Nenhum pagamento registrado.\n";
        }

        // Formato Carnê Leão: Data;Código;Valor;Histórico;Multa;Juros;Competência
        const rows = paymentList.map(payment => {
            // Converter data de AAAA-MM-DD para DD/MM/AAAA
            const dateFormatted = payment.paymentDate.split('-').reverse().join('/');

            // Remover separadores de milhares (pontos) mantendo vírgula decimal
            const amountWithoutThousands = payment.amount.replace(/\./g, "");
            const penaltyWithoutThousands = payment.penalty ? payment.penalty.replace(/\./g, "") : "";
            const interestWithoutThousands = payment.interest ? payment.interest.replace(/\./g, "") : "";

            // Competência no formato MM/AAAA
            const competence = payment.competenceMonth && payment.competenceYear
                ? `${payment.competenceMonth}/${payment.competenceYear}`
                : '';

            return [
                dateFormatted,                  // 1. Data do pagamento (DD/MM/AAAA)
                payment.expense.code,           // 2. Código do pagamento
                amountWithoutThousands,         // 3. Valor pago
                payment.history || "",          // 4. Histórico
                penaltyWithoutThousands,        // 5. Valor da Multa
                interestWithoutThousands,       // 6. Valor dos Juros
                competence                      // 7. Competência (MM/AAAA)
            ].join(";");
        });

        // BOM (Byte Order Mark) para UTF-8
        return '\uFEFF' + rows.join("\n");
    };

    // Retorno do JSX
    return (
        <div className="form-page-container">
            <div className='header-cadastro'>

                <img src="9.png" className="logo" alt="logo MA Contabil" />
                <nav>
                    <Link to='/' className="nav-button">Home</Link>
                </nav>
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

                {/* Despesa com busca */}
                <div className="form-group">
                    <label htmlFor="expense">Despesa:</label>
                    {!form.expense ? (
                        <>
                            <input
                                type="text"
                                placeholder="🔍 Buscar despesa..."
                                value={expenseSearch}
                                onChange={(e) => setExpenseSearch(e.target.value)}
                                style={{
                                    marginBottom: '8px',
                                    padding: '8px',
                                    fontSize: '14px',
                                    border: '2px solid var(--secondary-color)',
                                    borderRadius: '8px'
                                }}
                            />
                            <select
                                id="expense"
                                value={form.expense}
                                onChange={(e) => {
                                    handleInputChange('expense', e.target.value);
                                    setExpenseSearch(""); // Limpa a busca após selecionar
                                }}
                                required
                                size="6"
                                style={{
                                    minHeight: '150px',
                                    width: '100%'
                                }}
                            >
                                <option value="">Selecione uma despesa</option>
                                {filteredExpenses.map((option) => (
                                    <option key={option.code} value={option.code}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            {filteredExpenses.length === 0 && expenseSearch && (
                                <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '5px' }}>
                                    Nenhuma despesa encontrada
                                </p>
                            )}
                        </>
                    ) : (
                        <div style={{
                            padding: '12px',
                            backgroundColor: 'var(--background-light)',
                            border: '2px solid var(--success-color)',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <div>
                                <strong style={{ color: 'var(--primary-color)', display: 'block' }}>
                                    {expenseOptions.find(opt => opt.code === form.expense)?.name}
                                </strong>
                                <small style={{ color: 'var(--text-medium)' }}>
                                    {form.expense}
                                </small>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    handleInputChange('expense', '');
                                    setExpenseSearch('');
                                }}
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    backgroundColor: 'var(--secondary-color)',
                                    color: 'var(--text-dark)',
                                    border: 'none',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Alterar
                            </button>
                        </div>
                    )}
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

                {/* Competência - apenas para Previdência Oficial e Imposto Pago */}
                {requiresCompetence(form.expense) && (
                    <div className="form-group" style={{ flex: '1 1 100%' }}>
                        <label>
                            Competência: <span style={{ color: '#d32f2f' }}>*</span>
                            <small style={{ display: 'block', fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                                Obrigatório para {form.expense === 'P20.01.00001' ? 'Previdência Oficial' : 'Imposto Pago'}
                            </small>
                        </label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <select
                                value={form.competenceMonth}
                                onChange={(e) => handleInputChange('competenceMonth', e.target.value)}
                                style={{ flex: '0 0 auto', minWidth: '120px' }}
                                required
                            >
                                <option value="">Mês</option>
                                <option value="01">Janeiro</option>
                                <option value="02">Fevereiro</option>
                                <option value="03">Março</option>
                                <option value="04">Abril</option>
                                <option value="05">Maio</option>
                                <option value="06">Junho</option>
                                <option value="07">Julho</option>
                                <option value="08">Agosto</option>
                                <option value="09">Setembro</option>
                                <option value="10">Outubro</option>
                                <option value="11">Novembro</option>
                                <option value="12">Dezembro</option>
                            </select>
                            <select
                                value={form.competenceYear}
                                onChange={(e) => handleInputChange('competenceYear', e.target.value)}
                                style={{ flex: '0 0 auto', minWidth: '100px' }}
                                required
                            >
                                <option value="">Ano</option>
                                {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() - 5 + i;
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>
                            <button
                                type="button"
                                onClick={fillPreviousMonth}
                                className="quick-fill-button"
                                title="Preencher com mês anterior"
                            >
                                📅 Mês Anterior
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Exibe erro, se houver */}
            {error && <p className="error-message">{error}</p>}

            {/* Indicador de modo de edição */}
            {editingIndex !== null && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#FFF3CD',
                    border: '2px solid #FFC107',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#856404'
                }}>
                    ✏️ Editando pagamento #{editingIndex + 1}
                </div>
            )}

            {/* Botão de salvar */}
            <div className="form-actions">
                <button className="save-button" onClick={handleSave}>
                    {editingIndex !== null ? '✓ Atualizar' : 'Salvar'}
                </button>
                {editingIndex !== null && (
                    <button
                        className="cancel-button"
                        onClick={handleCancelEdit}
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            padding: '14px 30px',
                            fontSize: '16px',
                            border: 'none',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            margin: '0 10px'
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>

            {/* Lista de pagamentos salvos */}
            <h3 className="saved-payments-title">Pagamentos Salvos:</h3>
            {paymentList.length > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <p style={{
                        color: '#588157',
                        marginRight: '15px',
                        fontWeight: '600',
                        margin: '0 15px 0 0'
                    }}>Você tem {paymentList.length} pagamento(s) salvo(s)!</p>
                    <button
                        className="clear-button"
                        onClick={handleClearData}
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
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentList.map((payment, i) => (
                        <tr key={i} style={editingIndex === i ? { backgroundColor: '#FFF3CD' } : {}}>
                            <td>{payment.paymentDate.split('-').reverse().join('/')}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.expense.name}</td>
                            <td>{payment.penalty} - {payment.interest}</td>
                            <td style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                <button
                                    className="edit-button"
                                    onClick={() => handleEdit(i)}
                                    title="Editar"
                                    disabled={editingIndex !== null && editingIndex !== i}
                                >
                                    <span role="img" aria-label="edit">✏️</span>
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(i)}
                                    title="Excluir"
                                >
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
