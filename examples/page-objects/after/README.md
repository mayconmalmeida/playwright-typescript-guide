# After

O mesmo login foi dividido entre `pages/` (telas), `components/` (regiões reutilizáveis) e `tests/` (fluxo e assertions principais).

O ambiente é local e determinístico: `LoginPage.goto()` prepara o HTML com `page.setContent()`, sem servidor ou internet.
