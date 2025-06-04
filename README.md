# n8n-nodes-htmltopdf

Este é um nó personalizado para o [n8n](https://n8n.io) que converte conteúdo HTML em PDF utilizando o pacote [Puppeteer](https://pptr.dev/). Ideal para geração automatizada de relatórios, recibos e documentos visuais em fluxos n8n.

---

## ✨ Funcionalidades

- 📄 Converte HTML para PDF utilizando Chromium Headless
- 💡 Totalmente local, sem dependência de APIs externas
- 🔄 Retorna um arquivo binário pronto para envio por e-mail, API, etc.
- 📎 Compatível com qualquer node que aceite binários (e-mail, upload, mensagem)

---

## 📦 Instalação

Este pacote é compatível com instâncias **auto-hospedadas** do n8n.

1. Vá para `Settings > Community Nodes > Install`
2. Digite o nome do pacote: `n8n-nodes-htmltopdf`
3. Marque a opção de aceite
4. Clique em **Install**

---

## 🧪 Exemplo de uso

1. Use um node `Set` para fornecer um campo chamado `html` com o conteúdo desejado:
   ```json
   {
     "html": "<html><body><h1>Relatório</h1><p>Conteúdo do PDF</p></body></html>"
   }
   ```

2. Conecte ao node `HTML to PDF`

3. O output será um item binário com:
   - `fileName`: `html_to_pdf.pdf`
   - `mimeType`: `application/pdf`
   - `data`: conteúdo em base64 do PDF

Você pode conectar diretamente com nodes como:
- Email (como anexo)
- Telegram
- Dropbox / Google Drive
- HTTP Request (upload de arquivo)
- WhatsApp API (ex: Evolution)

---

## 🔧 Dependências

Este pacote utiliza o [Puppeteer](https://www.npmjs.com/package/puppeteer), que instala uma versão headless do Chromium.

Certifique-se de que o ambiente do n8n:
- Suporte Node.js >= 16
- Possua recursos de sistema para rodar Chromium Headless

---

## 📁 Estrutura do Projeto

```
n8n-nodes-htmltopdf/
├── nodes/
│   └── HtmlToPdf.node.ts
├── package.json
├── tsconfig.json
├── README.md
```

---

## 📜 Licença

MIT © [Seu Nome]

---

## 🔖 Tags NPM

```json
"keywords": [
  "n8n",
  "n8n-community-node-package",
  "pdf",
  "html",
  "puppeteer",
  "automation",
  "custom-node"
]
```