# Guia de Instalação - n8n-nodes-htmltopdf

## Pré-requisitos

- **n8n** instalado e funcionando (instância auto-hospedada)
- **Node.js** versão 16 ou superior
- Sistema operacional compatível com Chromium (Linux, Windows, macOS)

## Instalação

### Método 1: Via Interface do n8n (Recomendado)

1. Acesse sua instância do n8n
2. Vá para **Settings** → **Community Nodes**
3. Clique em **Install**
4. Digite o nome do pacote: `n8n-nodes-htmltopdf`
5. Marque a opção de aceite dos termos
6. Clique em **Install**
7. Aguarde a instalação e reinicie o n8n se necessário

### Método 2: Via NPM (Manual)

```bash
# No diretório do seu n8n
npm install n8n-nodes-htmltopdf

# Reinicie o n8n
npm start
```

## Verificação da Instalação

1. Crie um novo workflow
2. Adicione um novo nó
3. Procure por "HTML to PDF" na lista de nós disponíveis
4. Se aparecer, a instalação foi bem-sucedida

## Uso Básico

### Exemplo 1: HTML Simples

1. **Nó Set** (dados de entrada):
   ```json
   {
     "html": "<html><body><h1>Meu Relatório</h1><p>Conteúdo do documento</p></body></html>"
   }
   ```

2. **Nó HTML to PDF**:
   - HTML Content: `{{ $json.html }}`
   - Nome do Arquivo: `relatorio.pdf`

### Exemplo 2: HTML com Placeholders

1. **Nó Set**:
   ```json
   {
     "html": "<html><body><h1>{{titulo}}</h1><p>Cliente: {{cliente}}</p></body></html>",
     "titulo": "Fatura #001",
     "cliente": "João Silva"
   }
   ```

2. **Nó HTML to PDF**: O nó automaticamente substituirá `{{titulo}}` e `{{cliente}}` pelos valores correspondentes.

### Exemplo 3: Salvando em Pasta Local

1. Configure as **Opções Avançadas**:
   - Marque "Salvar em Pasta Local"
   - Caminho da Pasta: `/caminho/para/sua/pasta/pdfs`

2. O PDF será salvo tanto como arquivo binário (para próximos nós) quanto fisicamente na pasta especificada.

## Opções Avançadas

### Formato da Página
- A3, A4, A5, Letter, Legal, Tabloid
- Padrão: A4

### Orientação
- Retrato (padrão) ou Paisagem

### Margens
- Configuráveis em milímetros
- Padrão: 10mm em todos os lados

### Background
- Incluir ou não cores e imagens de fundo
- Padrão: Incluir

## Integração com Outros Nós

### Email
```
Set → HTML to PDF → Email Send
```
O PDF será anexado automaticamente ao email.

### Dropbox/Google Drive
```
Set → HTML to PDF → Dropbox/Google Drive
```
Upload direto para cloud storage.

### HTTP Request
```
Set → HTML to PDF → HTTP Request
```
Envio via API para outros sistemas.

## Solução de Problemas

### Erro: "Chromium não encontrado"
- Verifique se há espaço suficiente em disco
- Em servidores Linux, instale dependências:
  ```bash
  sudo apt-get update
  sudo apt-get install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgtk-3-0 libxss1 libgconf-2-4 libasound2
  ```

### Erro: "Memória insuficiente"
- Aumente a memória disponível para o n8n
- Use HTML mais simples e otimizado

### PDF não gerado corretamente
- Verifique se o HTML está bem formado
- Teste o HTML em um navegador primeiro
- Verifique se recursos externos (imagens, fonts) estão acessíveis

## Limitações

- Funciona apenas em instâncias auto-hospedadas do n8n
- Requer recursos de sistema para executar Chromium
- Não funciona no n8n.cloud (limitação de security)

## Suporte

Para reportar bugs ou solicitar recursos, acesse:
- GitHub Issues: [link-do-repositorio]
- Documentação: [link-da-documentacao]

## Exemplo Completo

Veja o arquivo `examples/example-workflow.json` para um exemplo completo de workflow que gera um relatório PDF e envia por email. 