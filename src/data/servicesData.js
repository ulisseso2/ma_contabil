// src/data/servicesData.js

// Importe os ícones que você vai usar. Exemplo:
// Você precisará instalar react-icons se ainda não o fez: npm install react-icons
import { FaChartLine, FaBriefcase, FaHandshake, FaBalanceScale, FaFileAlt, FaShieldAlt } from 'react-icons/fa';
// Outras opções de ícones podem vir de 'bs' (Bootstrap Icons), 'io' (Ionicons), etc.

const servicesData = [
    {
        id: 1,
        icon: <FaChartLine />, // Ícone de gráfico de linha
        title: "Consultoria Financeira",
        description: "Análise e planejamento estratégico para otimizar suas finanças e garantir o crescimento sustentável."
    },
    {
        id: 2,
        icon: <FaBriefcase />, // Ícone de maleta
        title: "Gestão de Negócios",
        description: "Suporte completo na gestão do seu dia a dia, desde a organização de processos até a tomada de decisões."
    },
    {
        id: 3,
        icon: <FaHandshake />, // Ícone de aperto de mãos
        title: "Planejamento Tributário",
        description: "Estratégias fiscais personalizadas para reduzir sua carga tributária de forma legal e eficiente."
    },
    {
        id: 4,
        icon: <FaBalanceScale />, // Ícone de balança (auditoria/justiça)
        title: "Auditoria Contábil",
        description: "Revisão detalhada de suas contas para garantir conformidade e identificar oportunidades de melhoria."
    },
    {
        id: 5,
        icon: <FaFileAlt />, // Ícone de arquivo
        title: "Serviços de Compliance",
        description: "Garantimos que sua empresa esteja em total conformidade com as normas e regulamentações vigentes."
    },
    {
        id: 6,
        icon: <FaShieldAlt />, // Ícone de escudo
        title: "Relatórios Personalizados",
        description: "Dados claros e objetivos para que você tenha total controle sobre a saúde financeira do seu negócio."
    }
];

export default servicesData;