# Patrick Ataíde | Portfólio

Portfólio profissional de Patrick Ataíde, com foco em Quality Assurance (QA), automação web, integração de sistemas e infraestrutura. O site apresenta sua trajetória, tecnologias, premiações, formação, projetos web e canais de contato..

- **Site:** [patrickataide.com.br](https://patrickataide.com.br/)
- **Repositório:** [github.com/pasilva1/patrickataide.com.br](https://github.com/pasilva1/patrickataide.com.br)

## Sobre o projeto

O site é uma página estática construída com HTML, CSS e JavaScript nativos. Não utiliza framework, servidor de aplicação ou processo de compilação: os arquivos podem ser servidos diretamente por qualquer hospedagem estática.

Entre os recursos da página estão:

- Layout responsivo com navegação para dispositivos móveis.
- Mapa interativo de tecnologias em SVG, com suporte a mouse e teclado.
- Seções de destaque profissional, formação e projetos de sites.
- Contatos por e-mail, telefone, LinkedIn e WhatsApp.
- Currículo em PDF disponível para download.
- Metadados para compartilhamento e dados estruturados de pessoa.

## Estrutura

```text
.
├── assets/
│   ├── aurora9.jpg
│   ├── favicon.svg
│   ├── hackathon.png
│   ├── patrick-ataide-cv.pdf
│   └── patrick.jpg
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── generate_cv.py
├── index.html
└── README.md
```

`index.html` contém o conteúdo e a estrutura da página. `css/styles.css` define o tema, o layout e os estados responsivos. `js/main.js` controla o menu móvel, o widget do WhatsApp e a interação com o mapa de tecnologias. `assets/` guarda imagens, ícone e o currículo publicado.

## Executar localmente

É possível abrir `index.html` diretamente no navegador. Para testar com um servidor HTTP local, na raiz do projeto execute:

```powershell
py -m http.server 8000
```

Abra [http://localhost:8000](http://localhost:8000). Para encerrar o servidor, pressione `Ctrl+C` no terminal.

Também é possível abrir a pasta no VS Code e iniciar um servidor estático com a extensão Live Server.

## Gerar o currículo

O script `generate_cv.py` cria `assets/patrick-ataide-cv.pdf` usando Python e a biblioteca ReportLab. No Windows, crie um ambiente virtual e instale a dependência:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install reportlab
```

Gere o PDF com:

```powershell
.\.venv\Scripts\python.exe generate_cv.py
```

O arquivo PDF existente será substituído. Revise o resultado antes de publicar o currículo atualizado.

## Publicar no Cloudflare Pages

O projeto não precisa de etapa de build e pode ser hospedado no plano gratuito do Cloudflare Pages.

1. No painel do Cloudflare, abra **Workers & Pages** e crie um projeto Pages conectado ao GitHub.
2. Selecione o repositório `pasilva1/patrickataide.com.br` e a branch `main`.
3. Escolha **None** como framework, deixe o comando de build vazio e defina `.` como diretório de saída.
4. Salve a configuração e aguarde a publicação. Os próximos pushes para `main` iniciarão novas implantações.

Os links para arquivos locais, como o currículo em `assets/`, são relativos à raiz do site e serão publicados com os demais arquivos.

## Atualizar o site

Depois de editar e testar os arquivos localmente, revise as mudanças e envie-as ao GitHub:

```powershell
git status
git add index.html css/styles.css js/main.js assets generate_cv.py
git commit -m "Atualiza portfolio"
git push origin main
```

Se o currículo ou alguma imagem não mudou, não é necessário regenerar ou adicionar esses arquivos. Confira sempre a lista de arquivos preparada com `git status` antes do commit.
