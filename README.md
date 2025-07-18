# 📊 MA Contabil - Seu Parceiro Contábil Digital

---

## Sobre o Projeto

Este é um aplicativo web **React.js** desenvolvido para a **MA Contabil**, oferecendo tanto um portal institucional para apresentar nossos serviços quanto uma ferramenta funcional para **gerenciamento e exportação de pagamentos**.

Nosso objetivo é simplificar a gestão contábil, permitindo que nossos clientes registrem suas despesas e gerem relatórios em CSV de forma rápida e eficiente.

## 🚀 Funcionalidades Principais

* **Site Institucional:**
    * Página inicial (`/`) com informações sobre a MA Contabil, nossos valores e serviços.
    * Navegação intuitiva com barra superior e rodapé.
* **Cadastro de Pagamentos:**
    * Interface dedicada (`/pagamentos`) para registro detalhado de pagamentos.
    * Campos para data, tipo de despesa (seleção), valor, histórico, multa, juros e competência.
    * Utiliza `localStorage` para persistir os dados dos pagamentos no navegador do usuário.
    * Opção para limpar todos os pagamentos registrados.
* **Exportação de Dados:**
    * Geração de arquivo **CSV** contendo todos os pagamentos registrados.
    * Funcionalidades para **compartilhar** o arquivo CSV diretamente pelo navegador (se suportado) ou fazer **download** para o seu dispositivo.
    * Nome do arquivo CSV personalizável com CNPJ/CPF e Razão Social/Nome do cliente.

## 🛠️ Tecnologias Utilizadas

* **React.js 19:** Biblioteca JavaScript para construção de interfaces de usuário.
* **React Router DOM 7.1.3:** Para gerenciamento de rotas e navegação na aplicação.
* **HTML5 & CSS3:** Estrutura e estilização das páginas, com foco em responsividade.
* **JavaScript (ES6+):** Lógica de programação e manipulação de dados.
* **Node.js & npm:** Ambiente de execução e gerenciador de pacotes.

## ⚙️ Como Configurar e Rodar o Projeto

Siga estes passos para ter o projeto rodando em sua máquina local:

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

* **Node.js** (versão LTS recomendada, ex: `v18.x` ou `v20.x`). Você pode usar o [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) para gerenciar suas versões do Node.js.
* **npm** (geralmente vem junto com o Node.js).
* **Git** (para clonar o repositório).

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    ```
    (Substitua `<URL_DO_SEU_REPOSITORIO>` pela URL real do seu repositório GitHub.)

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd macontabil_site
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Remova o arquivo `yarn.lock` (se existir), para evitar conflitos de gerenciamento de pacotes:**
    ```bash
    rm yarn.lock
    ```
    *(É bom ter apenas um lock file (`package-lock.json` para npm) para garantir a consistência das dependências.)*

### Rodando a Aplicação

Para iniciar o servidor de desenvolvimento:

```bash
npm start

```
## 📂 Estrutura do Projeto
.
├── public/                 # Arquivos públicos (index.html, imagens, etc.)
│   ├── index.html
│   └── favicon.ico
│   └── logobrancav1.jpg    # <-- Verifique se suas imagens estão aqui
│   └── logocorv1.jpg
│   └── imagem_contabilista.jpg
├── src/
│   ├── components/         # Componentes React reutilizáveis
│   │   ├── Footer.js
│   │   ├── NavBar.js
│   │   ├── PaymentForm.js
│   │   ├── Services.js
│   │   └── Section1.js
│   ├── css/                # Arquivos CSS para estilização
│   │   ├── App.css
│   │   └── FormPage.css
│   ├── data/               # Dados estáticos (ex: opções de despesa)
│   │   └── expenseOptions.json
│   ├── pages/              # Páginas principais da aplicação
│   │   ├── Home.js
│   │   └── PaymentFormPage.js
│   ├── App.js              # Componente principal do aplicativo
│   ├── index.js            # Ponto de entrada do React
│   └── reportWebVitals.js
├── .gitignore              # Arquivos e pastas a serem ignorados pelo Git
├── package.json            # Metadados e dependências do projeto
├── package-lock.json       # Bloqueio de versões das dependências
└── README.md               # Este arquivo!


## 🤝 Contribuição
Sinta-se à vontade para contribuir com este projeto! Se encontrar bugs ou tiver sugestões de melhoria, por favor, abra uma issue ou envie um pull request.

## 📄 Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes. (Crie este arquivo se ainda não existir)


** Ulisses Oliveira ** ulissesrce@gmail.com


---