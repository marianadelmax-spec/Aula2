# Loja — Atividade IA-2

Projeto desenvolvido em sala (React + Node/Express + MariaDB), mantendo a estrutura padrão da aula:

```
FrontEnd/   → React (Components, Pages, hooks, util)
Api/        → Node/Express (Controller, router, model, db, middleware)
```

## O que foi feito

1. Projeto publicado em repositório público no GitHub.
2. **CRUD de produtos integrado com o front** (`/produtos`): cadastrar, listar, editar e deletar usando a API.
3. **Imagens nos produtos** com validação para aceitar apenas **.jpeg** e **.png**
   (no front pelo `accept` e verificação do arquivo; na API pelo `multer`, checando extensão e tipo).
4. **Validação do preço**: não aceita números negativos (front, controller e model).
5. **Painel de vendas em `/home`** no padrão e-commerce: vitrine de produtos com busca, carrinho
   (adicionar, alterar quantidade, remover, esvaziar), forma de pagamento e **finalização da venda**.
6. **Endpoints de carrinho e venda** na API.

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| POST | /produto/create | Cria produto (form-data: `nome`, `preco`, `imagem`) |
| GET | /produto/getAll | Lista produtos |
| GET | /produto/getByID/:id | Busca produto |
| PUT | /produto/update/:id | Atualiza produto (form-data, imagem opcional) |
| DELETE | /produto/delete/:id | Deleta produto |
| POST | /carrinho/create | Cria carrinho |
| GET | /carrinho/getByID/:id | Busca carrinho com itens e total |
| POST | /carrinho/addItem/:id | Adiciona produto `{ produtoId, quantidade }` |
| PUT | /carrinho/updateItem/:id/:itemId | Altera quantidade `{ quantidade }` |
| DELETE | /carrinho/removeItem/:id/:itemId | Remove item |
| DELETE | /carrinho/clear/:id | Esvazia o carrinho |
| POST | /venda/create | Finaliza venda `{ carrinhoId, formaPagamento, cliente }` |
| GET | /venda/getAll | Lista vendas |
| GET | /venda/getByID/:id | Busca venda |

Formas de pagamento: `pix`, `dinheiro`, `cartao_credito`, `cartao_debito`.
As imagens ficam em `Api/public/images` e são acessadas em `http://localhost:5000/images/<arquivo>`.
A coleção do Postman está em `Api/Loja.postman_collection.json`.

## Como rodar

**Banco (MariaDB):** crie o banco `loja` (`CREATE DATABASE loja;`). As tabelas são criadas automaticamente.

**API**
```
cd Api
npm install
npm start
```
Por padrão usa o banco `loja` com usuário `root`/`root` na porta 5000.
Para mudar, crie `Api/.env` a partir de `Api/.env.example`.

**FrontEnd**
```
cd FrontEnd
npm install
npm start
```
Abre em `http://localhost:3000`. Se a API estiver em outra porta, crie `FrontEnd/.env.local` com
`REACT_APP_API_URL=http://localhost:<porta>`.
