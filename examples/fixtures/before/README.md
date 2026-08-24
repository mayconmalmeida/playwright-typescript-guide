# Before

Os dois cenários instanciam Page Objects, preparam a página e autenticam o mesmo usuário. O código ainda é legível, mas a preparação repetida compete com a intenção de cada teste.

A duplicação é intencional para tornar claro o problema que as Fixtures resolverão no `after`.

