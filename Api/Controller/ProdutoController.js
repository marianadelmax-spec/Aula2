const fs = require('fs');
const path = require('path');
const Produto = require('../model/Produto.js');

const pastaImagens = path.join(__dirname, '..', 'public', 'images');

function apagarImagem(nomeArquivo) {
    if (!nomeArquivo) return;
    fs.unlink(path.join(pastaImagens, nomeArquivo), () => {});
}

// retorna uma mensagem de erro ou null se o preço for válido
function validarPreco(preco) {
    if (preco === undefined || preco === null || preco === '') {
        return 'O preço é obrigatório';
    }
    const valor = Number(preco);
    if (Number.isNaN(valor)) {
        return 'O preço deve ser um número';
    }
    if (valor < 0) {
        return 'O preço não pode ser negativo';
    }
    return null;
}

module.exports = class ProdutoController {
    static async create(req, res) {
        const { nome, preco } = req.body || {};
        const imagem = req.file ? req.file.filename : null;

        if (!nome) {
            apagarImagem(imagem);
            res.status(422).json({ message: 'O nome é obrigatório' });
            return;
        }
        const erroPreco = validarPreco(preco);
        if (erroPreco) {
            apagarImagem(imagem);
            res.status(422).json({ message: erroPreco });
            return;
        }

        const produto = new Produto({
            nome: nome,
            preco: Number(preco),
            imagem: imagem
        });

        try {
            await produto.save();
            res.status(201).json({ message: 'Produto criado com sucesso!', produto });
        } catch (err) {
            apagarImagem(imagem);
            res.status(500).json({ message: 'Erro ao criar o produto: ' + err });
        }
    }

    static async getAll(req, res) {
        try {
            const produtos = await Produto.findAll({ order: [['id', 'ASC']] });
            res.status(200).json(produtos);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar os produtos: ' + err });
        }
    }

    static async getById(req, res) {
        const { id } = req.params;
        try {
            const produto = await Produto.findByPk(id);
            if (!produto) {
                res.status(422).json({ message: 'Produto não encontrado' });
                return;
            }
            res.status(200).json(produto);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar o produto: ' + err });
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        const { nome, preco } = req.body || {};
        const novaImagem = req.file ? req.file.filename : null;

        if (!nome) {
            apagarImagem(novaImagem);
            res.status(422).json({ message: 'O nome é obrigatório' });
            return;
        }
        const erroPreco = validarPreco(preco);
        if (erroPreco) {
            apagarImagem(novaImagem);
            res.status(422).json({ message: erroPreco });
            return;
        }

        try {
            const produto = await Produto.findByPk(id);
            if (!produto) {
                apagarImagem(novaImagem);
                res.status(422).json({ message: 'Produto não encontrado' });
                return;
            }

            const dados = { nome, preco: Number(preco) };
            if (novaImagem) {
                apagarImagem(produto.imagem);
                dados.imagem = novaImagem;
            }

            await produto.update(dados);
            res.status(200).json({ message: 'Produto atualizado com sucesso', produto });
        } catch (err) {
            apagarImagem(novaImagem);
            res.status(500).json({ message: 'Erro ao atualizar produto: ' + err });
        }
    }

    static async delete(req, res) {
        const { id } = req.params;
        try {
            const produto = await Produto.findByPk(id);
            if (!produto) {
                res.status(422).json({ message: 'Produto não encontrado' });
                return;
            }
            const imagem = produto.imagem;
            await produto.destroy();
            apagarImagem(imagem);
            res.status(200).json({ message: 'Produto deletado com sucesso' });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao deletar produto: ' + err });
        }
    }
};
