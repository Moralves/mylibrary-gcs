# MyLibrary

Sistema fullstack de biblioteca pessoal desenvolvido com Spring Boot e Angular, organizado para evolução incremental por Issues, feature branches, Pull Requests, tags e releases.

## Objetivo

O MyLibrary tem como objetivo permitir o gerenciamento de uma biblioteca pessoal, incluindo categorias, livros, empréstimos, devoluções, filtros, dashboard e relatório de empréstimos atrasados.

Nesta etapa inicial, o projeto contém apenas a baseline técnica necessária para iniciar o desenvolvimento profissional e rastreável das funcionalidades.

## Escopo da baseline inicial

Esta versão inicial contempla:

- Estrutura base do backend Spring Boot.
- Estrutura base do frontend Angular.
- Endpoint de verificação da API.
- Configuração inicial de ambiente de desenvolvimento.
- Organização inicial de pastas.
- Arquivo `.gitignore` profissional.
- Documentação inicial com README e CHANGELOG.

Funcionalidades de domínio, como categorias, livros e empréstimos, serão desenvolvidas posteriormente em branches específicas vinculadas às Issues do projeto.

## Stack tecnológica

### Backend

- Java 17
- Spring Boot 4.0.6
- Spring Web
- Spring Data JPA
- H2 Database
- Maven

### Frontend

- Angular 21+
- TypeScript 5.9
- CSS
- Angular Routing
- Services

### Gerência de Configuração de Software

- Git
- GitHub Issues
- Feature branches
- Pull Requests
- GitHub Actions
- Tags
- Releases
- CHANGELOG

## Estrutura do repositório

```text
mylibrary-gcs/
├── backend/
│   └── mylibrary-api/
├── frontend/
│   └── mylibrary-web/
├── docs/
├── .gitignore
├── README.md
└── CHANGELOG.md
```

## Como executar o backend

Pré-requisito: Java 17+ instalado e `JAVA_HOME` configurado.

1. `cd backend\mylibrary-api`
2. `.\mvnw.cmd clean verify`
3. `.\mvnw.cmd spring-boot:run`

## Como testar o health check

Endpoint: `GET http://localhost:8080/api/health`

Exemplo com `curl`:

```
curl http://localhost:8080/api/health
```

Resposta esperada:

```
{"status":"UP","application":"MyLibrary API"}
```

## Como executar o frontend

Pré-requisito: Node.js 22 (compatível com Angular 21).

1. `cd frontend\mylibrary-web`
2. `npm install`
3. `npm start`

## Estratégia de branches

- `main`: versão estável do projeto.
- `develop`: integração das funcionalidades.
- `feature/*`: desenvolvimento de requisitos.
- `release/*`: preparação de versões.
- `hotfix/*`: correções emergenciais.

## Fluxo profissional de desenvolvimento

1. Criar Issue com escopo e critérios claros.
2. Criar branch a partir de `develop`.
3. Implementar a funcionalidade com commits atômicos.
4. Abrir Pull Request para revisão.
5. Revisar e aprovar conforme checklist do projeto.
6. Fazer merge em `develop`.
7. Preparar release, criar tag e publicar release em `main`.

## Versionamento planejado

O projeto seguirá versionamento semântico (SemVer), com tags e releases rastreáveis no CHANGELOG.

## Status do projeto

Baseline inicial configurada e pronta para evolução do sistema.
