# Fixtures: antes e depois

Este exemplo evolui a arquitetura do Capítulo 6. Page Objects continuam organizando a interação com a interface; Fixtures passam a organizar o contexto e as dependências dos testes.

| Responsabilidade | Onde fica |
|---|---|
| Interagir com uma tela | Page Object |
| Representar uma região reutilizável | Component |
| Preparar e entregar dependências | Fixture |
| Coordenar preparação comum de um grupo | Hook |
| Executar uma função sem ciclo de vida | Helper |
| Descrever entradas e expectativas | Dados de teste |

Compare [`before/`](./before/) e [`after/`](./after/). Ambos são locais, determinísticos e usam `page.setContent()`.

