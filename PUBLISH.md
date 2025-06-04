# Guia de Publicação - n8n-nodes-htmltopdf

## Pré-requisitos para Publicação

1. **Conta no NPM**: Certifique-se de ter uma conta no [npmjs.com](https://npmjs.com)
2. **Login no NPM**: Execute `npm login` para fazer login
3. **Repositório Git**: Configure o repositório no GitHub/GitLab

## Passos para Publicação

### 1. Configurar o Repositório

Antes de publicar, configure os links corretos no `package.json`:

```json
{
  "homepage": "https://github.com/seu-usuario/n8n-nodes-htmltopdf",
  "author": {
    "name": "Seu Nome",
    "email": "seu.email@exemplo.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/seu-usuario/n8n-nodes-htmltopdf.git"
  }
}
```

### 2. Testar o Build

```bash
# Instalar dependências
npm install

# Fazer build do projeto
npm run build

# Verificar se não há erros
npm run lint
```

### 3. Testar Localmente

Antes de publicar, teste o pacote localmente:

```bash
# Gerar o pacote
npm pack

# Instalar o pacote gerado em uma instância local do n8n
npm install -g n8n-nodes-htmltopdf-1.0.0.tgz
```

### 4. Publicar no NPM

```bash
# Publicar o pacote
npm publish

# Ou se for a primeira vez:
npm publish --access public
```

### 5. Verificar a Publicação

1. Acesse [npmjs.com/package/n8n-nodes-htmltopdf](https://npmjs.com/package/n8n-nodes-htmltopdf)
2. Verifique se as informações estão corretas
3. Teste a instalação em uma instância limpa do n8n

## Atualizações Futuras

Para publicar atualizações:

```bash
# Atualizar a versão
npm version patch  # ou minor/major

# Publicar
npm publish
```

## Comandos Úteis

```bash
# Ver informações do pacote
npm view n8n-nodes-htmltopdf

# Ver versões publicadas
npm view n8n-nodes-htmltopdf versions --json

# Desativar uma versão (se necessário)
npm unpublish n8n-nodes-htmltopdf@1.0.0
```

## Checklist de Publicação

- [ ] Código testado e funcionando
- [ ] Build sem erros
- [ ] Lint sem problemas
- [ ] README.md atualizado
- [ ] Versão correta no package.json
- [ ] Links do repositório corretos
- [ ] Teste local realizado
- [ ] Documentação completa

## Pós-Publicação

1. **Monitorar Downloads**: Acompanhe as estatísticas no npmjs.com
2. **Suporte**: Responda issues e dúvidas no repositório
3. **Atualizações**: Mantenha compatibilidade com novas versões do n8n
4. **Documentação**: Mantenha a documentação atualizada

## Troubleshooting

### Erro: "Package já existe"

- Verifique se o nome não está em uso
- Considere usar um scoped package: `@seu-usuario/n8n-nodes-htmltopdf`

### Erro: "Não autorizado"

- Verifique se está logado: `npm whoami`
- Faça login: `npm login`

### Erro: "Arquivo não encontrado"

- Verifique se o build foi executado
- Confirme se os arquivos estão na pasta `dist/`
