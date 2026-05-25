# Changelog

Todas as mudancas relevantes deste projeto serao documentadas neste arquivo.

## [Unreleased]

### Added

- Espaco reservado para proximas mudancas.

## [1.0.0] - 2026-05-25

### Added

- RF01: CRUD de categorias com backend Spring Boot e frontend Angular (#1).
- RF02: CRUD de livros com vinculo por categoria (#2).
- RF04: Busca e filtros incorporados a listagem de livros (#2).
- RF03: Sistema de emprestimos e devolucoes (#3).
- Pipeline CI com validacao de backend e frontend via GitHub Actions.
- Interface responsiva para categorias, livros e emprestimos.
- Tratamento global de erros na API.
- Mapa de rastreabilidade do projeto.
- Guia de implementacao e contexto para agentes de IA.

### Changed

- Branch `develop` consolidada como branch de integracao das funcionalidades.
- Fluxo de Pull Requests validado por GitHub Actions antes do merge.
- Contagem de livros por categoria passou a refletir os vinculos reais.
- Status dos livros passou a ser atualizado automaticamente por emprestimos e devolucoes.

### Technical

- Backend com Spring Boot, JPA, H2, Service Layer, DTOs e tratamento global de excecoes.
- Frontend com Angular, TypeScript, services, rotas e componentes organizados por funcionalidade.
- GitHub Actions validando `mvn clean verify`, `npm ci` e `npm run build`.
- Versionamento semantico aplicado com tag inicial `v0.1.0` e preparacao da release `v1.0.0`.

## [0.1.0] - 2026-05-22

### Added

- Baseline inicial do repositorio.
- Setup inicial do backend Spring Boot.
- Setup inicial do frontend Angular.
- Endpoint de verificacao da API.
- Configuracao inicial do `.gitignore`.
- Documentacao inicial do projeto.
