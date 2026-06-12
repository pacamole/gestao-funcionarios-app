# 🏢 HR System - Sistema de Gestão de Recursos Humanos (Front-end)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

--- 

## 📌 Identificação do Projeto
* **Disciplina:** Tópicos Especiais em Sistemas - Projeto Final – Parte 2
* **Professor:** Diogo Deconto
* **Integrantes:**
  * [Luiz Henrique Magnagnagno](https://github.com/lumagno)
  * [Matheus Müller dos Santos](https://github.com/pacamole)
* **Curso:** Análise e Desenvolvimento de Sistemas (ADS) - Tópicos Especiais de Sistemas
* **Turma:** 2208230

---

## 📝 Resumo
O **HR System** é uma aplicação web *full-stack* (Single Page Application) desenvolvida para modernizar e centralizar a administração estrutural de uma organização. O sistema permite o gerenciamento completo da hierarquia corporativa, conectando Usuários, Áreas (departamentos com suporte a subáreas), Cargos e Funcionários. 

Construído com uma arquitetura moderna, o sistema utiliza React e TypeScript no Front-end com o padrão de Custom Hooks e React Router. Este Front-end atua consumindo de forma reativa a Minimal API em C# (.NET 8) desenvolvida pela equipe (disponível no repositório [pacamole/gestao-funcionarios](https://github.com/pacamole/gestao-funcionarios)), garantindo alta performance através da navegação de grafos de objetos (*Object Graph Navigation*) servidos pelo Entity Framework.

---

## ⚙️ Funcionalidades

* 👥 **Gestão de Controle de Acesso:** Listagem e gerenciamento de usuários do sistema e suas permissões.
* 🏢 **Gestão Departamental (Áreas):** Mapeamento da estrutura da empresa, incluindo o cruzamento de dados para identificar áreas hierarquicamente superiores (Áreas Pai) e seus respectivos responsáveis.
* 💼 **Gestão de Cargos:** Controle de posições corporativas, salários base e vinculação estrita direta a áreas específicas.
* 👨‍💼 **Gestão de Funcionários:** Painel centralizado que consolida as contratações (CLT/PJ), controle de validade de contratos e relacionamento dinâmico com Cargos e Usuários.
* 🔄 **[EM DESENVOLVIMENTO] Operações de Mutação (CRUD):** Inserção, edição e remoção de dados das entidades através de formulários interativos.

---

## 📖 Descrição das Funcionalidades

* **Gestão de Controle de Acesso:** Consome o endpoint `/usuarios` para exibir os credenciados no sistema. Garante que apenas perfis autorizados possam interagir com a infraestrutura do RH.
* **Gestão Departamental:** Através do endpoint `/areas`, o Front-end utiliza o método estrutural `.find()` para relacionar e exibir os nomes das Áreas Pai na tabela, evitando a visualização crua de UUIDs e melhorando a experiência do usuário.
* **Gestão de Cargos:** A listagem de cargos aproveita o retorno otimizado da API através da navegação de grafos de objetos (*Object Graph Navigation*). Com o relacionamento já resolvido no Back-end, o Front-end realiza uma única chamada simplificada, acessando diretamente os dados aninhados do departamento associado ao cargo, o que melhora a performance de rede e simplifica o estado da tela.
* **Gestão de Funcionários:** A tela mais complexa do sistema, também estruturada para consumir os dados em formato de árvore. Trata a conversão de datas globais (ISO 8601) para os padrões locais de exibição e utiliza *Optional Chaining* para proteger a interface de quebras caso dados relacionais opcionais venham ausentes.

---

## 🔗 Repositório e Apresentação
* **Front-end:** [https://github.com/pacamole/gestao-funcionarios-app](https://github.com/pacamole/gestao-funcionarios-app)
* **Back-end / API:** [https://github.com/pacamole/gestao-funcionarios](https://github.com/pacamole/gestao-funcionarios)
* **Vídeo de Apresentação:** [Cole o link do YouTube/Drive aqui quando gravarem]

---

## 🚀 Como executar o projeto

**Pré-requisitos**
Antes de começar, você precisará ter instalado em sua máquina:
* [Git](https://git-scm.com)
* [.NET 8 SDK](https://dotnet.microsoft.com/pt-br/download/dotnet/8.0) (Para rodar a API)
* [Node.js](https://nodejs.org/) (Para rodar o Front-end)

### 1. Rodando o Back-end (API C#)
Abra o seu terminal/cmd e execute os seguintes comandos:

**Clone o repositório da API**
```bash
git clone https://github.com/pacamole/gestao-funcionarios.git
```

**Entre na pasta raiz do projeto clonado**
```bash
cd gestao-funcionarios
```

**Entre na pasta específica da API**
```bash
cd API 
```

**Restaure as dependências do .NET**
```bash
dotnet restore
```

Execute a aplicação (o banco de dados SQLite será inicializado)
```bash
dotnet run
```
*A API estará rodando geralmente em `http://localhost:5096` ou outro porto definido no `launchSettings.json`.*

### 2. Rodando o Front-end (React)
Abra uma **nova janela** de terminal/cmd (mantenha a API rodando na anterior) e execute:

**Clone o repositório do Front-end**
```bash
git clone https://github.com/pacamole/gestao-funcionarios-app.git
```

**Entre na pasta do projeto**
```bash
cd gestao-funcionarios-app
```

**Instale as dependências do Node**
```bash
npm install
```

**Inicie o servidor de desenvolvimento**
```bash
npm start 
```

*O Front-end abrirá automaticamente no seu navegador.*

---

## 🤖 Uso de IA
O desenvolvimento e a documentação deste projeto contaram com o auxílio da inteligência artificial **Google Gemini**.

* **Forma de uso:** * Geração do texto base para a documentação técnica (este README).
  * Auxílio arquitetural no *Front-end* para a separação de responsabilidades utilizando o *Hooks Pattern* (`useAreas`, `useCargos`).
  * Consultoria técnica para a implementação do sistema de rotas (SPA) com `react-router-dom` e layout flexível.
  * Solução de *troubleshooting* de CSS e prevenção de loops infinitos no ciclo de vida de componentes React (`useEffect`).
* **Revisões realizadas pela equipe:** * Todo o código sugerido foi ativamente testado, revisado e adaptado para a realidade do modelo de dados C# construído pela equipe.
  * O texto gerado para a documentação foi validado pela equipe para garantir o alinhamento estrito com os requisitos da disciplina.