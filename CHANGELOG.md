# Changelog

Todas as mudancas relevantes deste projeto serao documentadas neste arquivo.

## [Unreleased]

### Added

- RF03: Sistema de emprestimos e devolucoes com atualizacao automatica do status do livro (#3).
- Endpoints REST de emprestimos:
  - `GET /api/loans`
  - `GET /api/loans/active`
  - `GET /api/books/{bookId}/loans`
  - `POST /api/loans`
  - `POST /api/loans/{id}/return`
- Regras de negocio para impedir emprestimo de livro ja emprestado.
- Regras de negocio para impedir devolucao de livro disponivel ou emprestimo ja devolvido.
- Interface responsiva para registrar emprestimos e devolucoes no frontend Angular.
- RF02: CRUD de livros com vinculo obrigatorio a categorias (#2).
- Endpoints REST de livros:
  - `GET /api/books`
  - `GET /api/books/{id}`
  - `POST /api/books`
  - `DELETE /api/books/{id}`
- Filtros combinaveis na listagem de livros por categoria, status e texto (titulo/autor).
- Regra de negocio para impedir exclusao de livros emprestados.
- Regra de negocio para impedir exclusao de categorias com livros vinculados.
- Contagem real de livros por categoria na API de categorias.
- Interface responsiva para gerenciamento de livros no frontend Angular.
- Navegacao principal e rota de Livros no frontend.
- RF01: CRUD de categorias com backend Spring Boot e frontend Angular (#1).
- Endpoints REST de categorias:
  - `GET /api/categories`
  - `POST /api/categories`
  - `DELETE /api/categories/{id}`
- Interface responsiva para gerenciamento de categorias.
- Validacoes de nome obrigatorio, nome em branco e nome duplicado.
- Tratamento global de erros para respostas amigaveis da API.
- Pipeline CI com validacao de backend e frontend via GitHub Actions.
- Correcao do `package-lock.json` para compatibilidade com `npm ci` no pipeline.
- Setup inicial do backend Spring Boot.
- Setup inicial do frontend Angular.
- Endpoint de verificacao da API.
- Configuracao inicial do `.gitignore`.
- Documentacao inicial do projeto (README e CHANGELOG).
- Maven Wrapper para execucao do backend sem instalacao local de Maven.

### Changed

- Branch `develop` passou a concentrar funcionalidades validadas por Pull Request.
- Fluxo de Pull Requests passou a ser validado com GitHub Actions antes do merge.
- RF04 Busca e Filtros foi incorporado dentro da implementacao de RF02 CRUD Livros.
- Atualizacao do frontend para Angular 21 e TypeScript 5.9, compativel com Node.js 22.
- Atualizacao das instrucoes de execucao do backend no README.

## [0.1.0] - 2026-05-22

### Added

- Baseline inicial do repositorio.
