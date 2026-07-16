# Bad Structure

> ⚠️ Esta estrutura existe apenas para fins didáticos. Ela não deve ser copiada — é o exemplo do que evitar.

## O que está errado aqui

### Responsabilidades misturadas
Testes, seletores, dados e helpers convivem na mesma pasta (`tests/`), sem nenhuma separação. Para entender um único teste, é preciso ler arquivos que não têm relação direta com ele.

### Duplicação
`login.spec.ts` e `login-final.spec.ts` testam a mesma coisa de formas diferentes. `helpers.ts` e `utils-final.ts` guardam o mesmo tipo de função. Isso acontece quando arquivos são copiados "para não quebrar o que já funciona" em vez de atualizados.

### Manutenção difícil
`selectors.ts` e `data.ts` misturam domínios diferentes (login, carteira) no mesmo arquivo. Uma mudança em qualquer tela obriga a mexer em um arquivo compartilhado por todo o projeto.

### Crescimento complicado
Cada novo domínio (carteira, usuários, pagamentos...) tende a virar mais um `.spec.ts` solto na mesma pasta, e mais linhas nos mesmos `selectors.ts`, `data.ts` e `helpers.ts`. Não há um lugar óbvio para colocar código novo.

## Compare com a estrutura recomendada

Veja [`../good-structure/`](../good-structure/) para o mesmo conjunto de funcionalidades organizado por domínio.

Leia também [`docs/05-organizando-projeto-playwright.md`](../../../docs/05-organizando-projeto-playwright.md) para o capítulo completo.
