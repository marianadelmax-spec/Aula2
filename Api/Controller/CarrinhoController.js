const Carrinho = require('../model/Carrinho.js');
const ItemCarrinho = require('../model/ItemCarrinho.js');
const Produto = require('../model/Produto.js');

// busca o carrinho com os itens, os produtos e o total calculado
async function montarCarrinho(id) {
    const carrinho = await Carrinho.findByPk(id, {
        include: [{
            model: ItemCarrinho,
            as: 'itens',
            include: [{ model: Produto, as: 'produto' }]
        }],
        order: [[{ model: ItemCarrinho, as: 'itens' }, 'id', 'ASC']]
    });
    if (!carrinho) return null;

    const dados = carrinho.toJSON();
    let total = 0;
    let quantidadeItens = 0;
    dados.itens = dados.itens.map((item) => {
        const preco = item.produto ? Number(item.produto.preco) : 0;
        const subtotal = preco * item.quantidade;
        total += subtotal;
        quantidadeItens += item.quantidade;
        return { ...item, subtotal: Number(subtotal.toFixed(2)) };
    });
    dados.total = Number(total.toFixed(2));
    dados.quantidadeItens = quantidadeItens;
    return dados;
}

function validarQuantidade(quantidade) {
    const valor = Number(quantidade);
    return Number.isInteger(valor) && valor >= 1;
}

module.exports = class CarrinhoController {
    static async create(req, res) {
        try {
            const carrinho = await Carrinho.create({ status: 'aberto' });
            res.status(201).json({ message: 'Carrinho criado com sucesso!', carrinho: await montarCarrinho(carrinho.id) });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar o carrinho: ' + err });
        }
    }

    static async getById(req, res) {
        try {
            const carrinho = await montarCarrinho(req.params.id);
            if (!carrinho) {
                res.status(422).json({ message: 'Carrinho não encontrado' });
                return;
            }
            res.status(200).json(carrinho);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar o carrinho: ' + err });
        }
    }

    static async addItem(req, res) {
        const { id } = req.params;
        const { produtoId } = req.body || {};
        const quantidade = (req.body || {}).quantidade === undefined ? 1 : req.body.quantidade;

        if (!produtoId) {
            res.status(422).json({ message: 'O produto é obrigatório' });
            return;
        }
        if (!validarQuantidade(quantidade)) {
            res.status(422).json({ message: 'A quantidade deve ser um número inteiro maior que zero' });
            return;
        }

        try {
            const carrinho = await Carrinho.findByPk(id);
            if (!carrinho) {
                res.status(422).json({ message: 'Carrinho não encontrado' });
                return;
            }
            if (carrinho.status !== 'aberto') {
                res.status(422).json({ message: 'Este carrinho já foi finalizado' });
                return;
            }
            const produto = await Produto.findByPk(produtoId);
            if (!produto) {
                res.status(422).json({ message: 'Produto não encontrado' });
                return;
            }

            // se o produto já está no carrinho, soma a quantidade
            const item = await ItemCarrinho.findOne({ where: { carrinhoId: id, produtoId } });
            if (item) {
                await item.update({ quantidade: item.quantidade + Number(quantidade) });
            } else {
                await ItemCarrinho.create({ carrinhoId: id, produtoId, quantidade: Number(quantidade) });
            }

            res.status(200).json({ message: 'Produto adicionado ao carrinho', carrinho: await montarCarrinho(id) });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao adicionar produto ao carrinho: ' + err });
        }
    }

    static async updateItem(req, res) {
        const { id, itemId } = req.params;
        const { quantidade } = req.body || {};

        if (!validarQuantidade(quantidade)) {
            res.status(422).json({ message: 'A quantidade deve ser um número inteiro maior que zero' });
            return;
        }

        try {
            const carrinho = await Carrinho.findByPk(id);
            if (!carrinho || carrinho.status !== 'aberto') {
                res.status(422).json({ message: 'Carrinho não encontrado ou já finalizado' });
                return;
            }
            const item = await ItemCarrinho.findOne({ where: { id: itemId, carrinhoId: id } });
            if (!item) {
                res.status(422).json({ message: 'Item não encontrado no carrinho' });
                return;
            }
            await item.update({ quantidade: Number(quantidade) });
            res.status(200).json({ message: 'Quantidade atualizada', carrinho: await montarCarrinho(id) });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao atualizar item do carrinho: ' + err });
        }
    }

    static async removeItem(req, res) {
        const { id, itemId } = req.params;
        try {
            const carrinho = await Carrinho.findByPk(id);
            if (!carrinho || carrinho.status !== 'aberto') {
                res.status(422).json({ message: 'Carrinho não encontrado ou já finalizado' });
                return;
            }
            const item = await ItemCarrinho.findOne({ where: { id: itemId, carrinhoId: id } });
            if (!item) {
                res.status(422).json({ message: 'Item não encontrado no carrinho' });
                return;
            }
            await item.destroy();
            res.status(200).json({ message: 'Item removido do carrinho', carrinho: await montarCarrinho(id) });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao remover item do carrinho: ' + err });
        }
    }

    static async clear(req, res) {
        const { id } = req.params;
        try {
            const carrinho = await Carrinho.findByPk(id);
            if (!carrinho || carrinho.status !== 'aberto') {
                res.status(422).json({ message: 'Carrinho não encontrado ou já finalizado' });
                return;
            }
            await ItemCarrinho.destroy({ where: { carrinhoId: id } });
            res.status(200).json({ message: 'Carrinho esvaziado', carrinho: await montarCarrinho(id) });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao esvaziar o carrinho: ' + err });
        }
    }
};

module.exports.montarCarrinho = montarCarrinho;
