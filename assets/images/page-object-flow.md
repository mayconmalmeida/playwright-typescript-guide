# Fluxo com Page Objects

```mermaid
flowchart LR
    T[Teste: comportamento e assertions] --> LP[LoginPage]
    T --> DP[DashboardPage]
    DP --> N[NavbarComponent]
    T -. consulta estado .-> TO[ToastComponent]
    DP -. inicia logout .-> M[ConfirmationModalComponent]
    LP --> UI[Interface local]
    N --> UI
    TO --> UI
    M --> UI
```

O teste descreve o comportamento esperado e mantém as assertions visíveis. Pages encapsulam telas completas; Components encapsulam partes reutilizáveis. Nenhuma abstração decide se o teste passou.
