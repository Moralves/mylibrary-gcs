# Changelog

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

## [Unreleased]

### Added

- RF02: CRUD de livros com vínculo obrigatório a categorias (#2).
- Endpoints REST de livros:
  - `GET /api/books`
  - `GET /api/books/{id}`
  - `POST /api/books`
  - `DELETE /api/books/{id}`
- Filtros combináveis na listagem de livros por categoria, status e texto (título/autor).
- Regra de negócio para impedir exclusão de livros emprestados.
- Regra de negócio para impedir exclusão de categorias com livros vinculados.
- Contagem real de livros por categoria na API de categorias.
- Interface responsiva para gerenciamento de livros no frontend Angular.
- Navegação principal e rota de Livros no frontend.
- RF01: CRUD de categorias com backend Spring Boot e frontend Angular (#1).
- Endpoints REST de categorias:
  - `GET /api/categories`
  - `POST /api/categories`
  - `DELETE /api/categories/{id}`
- Interface responsiva para gerenciamento de categorias.
- Validações de nome obrigatório, nome em branco e nome duplicado.
- Tratamento global de erros para respostas amigáveis da API.
- Pipeline CI com validação de backend e frontend via GitHub Actions.
- Correção do `package-lock.json` para compatibilidade com `npm ci` no pipeline.
- Setup inicial do backend Spring Boot.
- Setup inicial do frontend Angular.
- Endpoint de verificação da API.
- Configuração inicial do `.gitignore`.
- Documentação inicial do projeto (README e CHANGELOG).
- Maven Wrapper para execução do backend sem instalação local de Maven.

### Changed

- Branch `develop` passou a concentrar funcionalidades validadas por Pull Request.
- Fluxo de Pull Requests passou a ser validado com GitHub Actions antes do merge.
- RF04 Busca e Filtros foi incorporado dentro da implementação de RF02 CRUD Livros.
- Atualização do frontend para Angular 21 e TypeScript 5.9, compatível com Node.js 22.
- Atualização das instruções de execução do backend no README.

## [0.1.0] - 2026-05-22

### Added

- Baseline inicial do repositório.
