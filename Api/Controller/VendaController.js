const db = require('../db/conn.js');
const Venda = require('../model/Venda.js');
const ItemVenda = require('../model/ItemVenda.js');
const Carrinho = require('../model/Carrinho.js');
const ItemCarrinho = require('../model/ItemCarrinho.js');
const { montarCarrinho } = require('./CarrinhoController.js');

const formasPagamento = ['pix', 'dinheiro', 'cartao_credito', 'cartao_debito'];

module.exports = class VendaController {
    // finaliza a venda a partir de um carrinho aberto
    static async create(req, res) {
        const { carrinhoId, formaPagamento, cliente } = req.body || {};

        if (!carrinhoId) {
            res.status(422).json({ message: 'O carrinho é obrigatório' });
            return;
        }
        if (!formaPagamento || !formasPagamento.includes(formaPagamento)) {
            res.status(422).json({ message: 'Forma de pagamento inválida. Use: ' + formasPagamento.join(', ') });
            return;
        }

        const t = await db.transaction();
        try {
            const carrinho = await montarCarrinho(carrinhoId);
            if (!carrinho) {
                await t.rollback();
                res.status(422).json({ message: 'Carrinho não encontrado' });
                return;
            }
            if (carrinho.status !== 'aberto') {
                await t.rollback();
                res.status(422).json({ message: 'Este carrinho já foi finalizado' });
                return;
            }
            const itensValidos = carrinho.itens.filter((item) => item.produto);
            if (itensValidos.length === 0) {
                await t.rollback();
                res.status(422).json({ message: 'O carrinho está vazio' });
                return;
            }

            const venda = await Venda.create({
                total: carrinho.total,
                formaPagamento,
                cliente: cliente || null,
                carrinhoId: carrinho.id
            }, { transaction: t });

            await ItemVenda.bulkCreate(itensValidos.map((item) => ({
                vendaId: venda.id,
                produtoId: item.produto.id,
                nomeProduto: item.produto.nome,
                precoUnitario: Number(item.produto.preco),
                quantidade: item.quantidade,
                subtotal: item.subtotal
            })), { transaction: t });

            await Carrinho.update({ status: 'finalizado' }, { where: { id: carrinho.id }, transaction: t });

            await t.commit();

            const vendaCompleta = await Venda.findByPk(venda.id, {
                include: [{ model: ItemVenda, as: 'itens' }]
            });
            res.status(201).json({ message: 'Venda finalizada com sucesso!', venda: vendaCompleta });
        } catch (err) {
            await t.rollback();
            res.status(500).json({ message: 'Erro ao finalizar a venda: ' + err });
        }
    }

    static async getAll(req, res) {
        try {
            const vendas = await Venda.findAll({
                include: [{ model: ItemVenda, as: 'itens' }],
                order: [['id', 'DESC']]
            });
            res.status(200).json(vendas);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar as vendas: ' + err });
        }
    }

    static async getById(req, res) {
        try {
            const venda = await Venda.findByPk(req.params.id, {
                include: [{ model: ItemVenda, as: 'itens' }]
            });
            if (!venda) {
                res.status(422).json({ message: 'Venda não encontrada' });
                return;
            }
            res.status(200).json(venda);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar a venda: ' + err });
        }
    }
};
