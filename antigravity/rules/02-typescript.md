# 📘 Rules — TypeScript

## 1. Objetivo

Estabelecer padrões obrigatórios para utilização do TypeScript no projeto DeliveryControl, garantindo:

- Tipagem segura e previsível.
- Código legível e fácil de manter.
- Contratos claros entre Front-end e Back-end.
- Redução de erros em tempo de execução.
- Reutilização de tipos e interfaces.
- Facilidade para testes, refatoração e evolução do projeto.

O TypeScript deve ser utilizado para aumentar a segurança do código, e não apenas para adicionar tipos superficialmente.

---

# 2. Princípios gerais

Todo código TypeScript deve seguir os seguintes princípios:

- Preferir tipagem explícita quando ela melhorar a compreensão do código.
- Utilizar inferência de tipos quando o TypeScript conseguir determinar o tipo corretamente.
- Evitar `any`.
- Evitar `as` desnecessário.
- Evitar tipos genéricos demais.
- Priorizar tipos pequenos, específicos e reutilizáveis.
- Não duplicar tipos que já existem no projeto.
- Manter os tipos próximos do domínio ao qual pertencem.
- Não utilizar TypeScript apenas para satisfazer o compilador.
- Corrigir a origem de problemas de tipagem em vez de mascará-los.

---

# 3. Configuração

O projeto deve utilizar uma configuração de TypeScript rigorosa sempre que possível.

Preferir:

```json
{
  "compilerOptions": {
    "strict": true
  }
}