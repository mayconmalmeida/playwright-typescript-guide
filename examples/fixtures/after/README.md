# After

Os cenários recebem dependências prontas pela fixture customizada criada com `test.extend()`. As Pages ainda contêm locators e ações; os testes ainda contêm as assertions.

`authenticatedUser` depende de `loginPage`, `dashboardPage` e `user`. Ela prepara o login antes de `use()` e limpa o documento depois dele, deixando explícitos setup e teardown.

Mantivemos tudo em `fixtures/test.fixture.ts`: separar uma segunda extensão para autenticação criaria composição acidentalmente complexa para um exemplo pequeno.

