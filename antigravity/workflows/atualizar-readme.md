# Workflow: Atualizar README

## Quando usar

Usar quando houver alteração em instalação, execução, arquitetura, funcionalidades,
variáveis de ambiente, scripts, API, persistência ou deploy.

## Processo

1. Comparar a alteração com `package.json`, `vite.config.ts`, `backend/server.ts` e a estrutura real de `frontend/` e `backend/`.
2. Atualizar somente as seções impactadas do `README.md`.
3. Manter o estado atual separado do roadmap: JSON local é desenvolvimento; PostgreSQL é alvo de produção.
4. Conferir comandos reais (`npm install`, `npm run dev`, `npm run lint`, `npm run build`, `npm start`).
5. Conferir endpoints montados sob `/api` e links para `antigravity/spec-kit/`.
6. Remover afirmações de funcionalidades ainda não implementadas, como OAuth Google, Helmet ou rate limiting.

## Critérios

- Não documentar funcionalidades inexistentes.
- Não inventar comandos ou endpoints.
- Não expor secrets, tokens ou credenciais.
- Manter a documentação em português e sem duplicar o spec-kit.
