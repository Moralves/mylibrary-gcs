# MyLibrary

Sistema fullstack de biblioteca pessoal com backend Spring Boot e frontend Angular, desenvolvido com foco em Gerencia de Configuracao de Software (GCS).

## Objetivo

Consolidar uma base estavel para gerenciamento de biblioteca pessoal, com rastreabilidade de requisitos, fluxo de mudancas controlado e validacao automatizada no CI.

## Funcionalidades disponiveis na v1.0.0

- Gerenciamento de categorias (RF01).
- Gerenciamento de livros com vinculo por categoria (RF02).
- Busca e filtros de livros por categoria, status e texto (RF04 incorporado ao RF02).
- Sistema de emprestimos de livros (RF03).
- Devolucao de livros emprestados (RF03).
- Atualizacao automatica do status do livro durante emprestimo e devolucao.
- Interface responsiva para categorias, livros e emprestimos.
- Pipeline CI com GitHub Actions validando backend e frontend.

Dashboard (RF05) e relatorio de atrasados (RF06) permanecem como evolucao futura.

## Stack tecnologica

### Backend

- Java 17
- Spring Boot 4.0.6
- Spring Web
- Spring Data JPA
- Spring Validation
- H2 Database
- Maven Wrapper

### Frontend

- Angular 21.2.x
- TypeScript 5.9.x
- Node.js 22.12.0
- npm 11.5.2
- CSS

### CI e GCS

- Git + GitHub
- GitHub Issues
- Feature branches e Pull Requests
- GitHub Actions
- CHANGELOG e rastreabilidade em `docs/`

## Estrutura do repositorio

```text
mylibrary-gcs/
|-- backend/
|   `-- mylibrary-api/
|-- frontend/
|   `-- mylibrary-web/
|-- docs/
|-- .github/workflows/
|-- CHANGELOG.md
`-- README.md
```

## Como executar o backend

Pre-requisitos:

- Java 17+
- `JAVA_HOME` configurado

Comandos:

```powershell
cd backend/mylibrary-api
.\mvnw.cmd clean verify
.\mvnw.cmd spring-boot:run
```

API local: `http://localhost:8080/api`  
Health check: `GET http://localhost:8080/api/health`

## Como executar o frontend

Pre-requisitos:

- Node.js `22.12.0`
- npm `11.5.2`

Comandos:

```powershell
cd frontend/mylibrary-web
npm ci
npm start
```

Aplicacao local: `http://localhost:4200`

## Resumo da API

### Categorias

- `GET /api/categories`
- `POST /api/categories`
- `DELETE /api/categories/{id}`

### Livros

- `GET /api/books`
- `GET /api/books/{id}`
- `GET /api/books/{bookId}/loans`
- `POST /api/books`
- `DELETE /api/books/{id}`

Filtros na listagem de livros:

- `categoryId`
- `status` (`AVAILABLE` ou `BORROWED`)
- `search` (titulo/autor)

### Emprestimos

- `GET /api/loans`
- `GET /api/loans/active`
- `POST /api/loans`
- `POST /api/loans/{id}/return`

## Estrategia de branches

- `main`: versoes estaveis.
- `develop`: branch de integracao.
- `feature/*`: desenvolvimento por requisito.
- `release/*`: preparacao de release.
- `hotfix/*`: correcao emergencial apos release.

## Fluxo de GCS aplicado

1. Requisito registrado em Issue.
2. Implementacao em `feature/*` a partir de `develop`.
3. Validacao automatica no GitHub Actions.
4. Revisao e merge via Pull Request em `develop`.
5. Consolidacao em `release/*` para preparacao da versao.
6. Publicacao com tag semantica e atualizacao de rastreabilidade.

## Versionamento

O projeto adota SemVer:

- `v0.1.0`: baseline inicial.
- `v1.0.0`: primeira entrega estavel com RF01, RF02/RF04 e RF03.

## Status da versao atual

Release `v1.0.0` em preparacao na branch `release/v1.0.0`, com funcionalidades obrigatorias concluidas e pipeline CI ativo.
