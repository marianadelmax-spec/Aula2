import { useEffect, useState } from "react";
import ProdutoCard from "../../Components/ProdutoCard";
import Carrinho from "../../Components/Carrinho";
import useProduto from "../../hooks/useProduto";
import useCarrinho from "../../hooks/useCarrinho";
import useVenda from "../../hooks/useVenda";
import { mensagemErro } from "../../util/api";

const CHAVE_CARRINHO = 'carrinhoId';

function lerCarrinhoSalvo() {
    try { return localStorage.getItem(CHAVE_CARRINHO); } catch (e) { return null; }
}
function salvarCarrinho(id) {
    try { localStorage.setItem(CHAVE_CARRINHO, id); } catch (e) { /* sem localStorage */ }
}

const Home = () => {
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState('');
    const [carrinho, setCarrinho] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [cliente, setCliente] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('pix');
    const [mensagem, setMensagem] = useState(null);
    const [vendaFinalizada, setVendaFinalizada] = useState(null);

    const { getAll } = useProduto();
    const carrinhoApi = useCarrinho();
    const vendaApi = useVenda();

    async function novoCarrinho() {
        const novo = await carrinhoApi.create();
        salvarCarrinho(novo.id);
        setCarrinho(novo);
        return novo;
    }

    // usa o carrinho salvo no navegador; se não existir ou já foi finalizado, cria outro
    async function iniciarCarrinho() {
        const idSalvo = lerCarrinhoSalvo();
        if (idSalvo) {
            try {
                const salvo = await carrinhoApi.getById(idSalvo);
                if (salvo.status === 'aberto') {
                    setCarrinho(salvo);
                    return;
                }
            } catch (e) { /* carrinho não existe mais */ }
        }
        await novoCarrinho();
    }

    useEffect(() => {
        async function iniciar() {
            try {
                const dados = await getAll();
                setProdutos(dados);
                await iniciarCarrinho();
            } catch (err) {
                setMensagem({ tipo: 'danger', texto: mensagemErro(err) });
            }
        }
        iniciar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // executa uma ação no carrinho mostrando carregamento e erros
    async function acaoCarrinho(acao) {
        setCarregando(true);
        setMensagem(null);
        try {
            const atualizado = await acao();
            setCarrinho(atualizado);
        } catch (err) {
            setMensagem({ tipo: 'danger', texto: mensagemErro(err) });
        } finally {
            setCarregando(false);
        }
    }

    function adicionar(produto) {
        setVendaFinalizada(null);
        acaoCarrinho(() => carrinhoApi.addItem(carrinho.id, produto.id, 1));
    }

    function alterarQuantidade(item, quantidade) {
        if (quantidade < 1) return;
        acaoCarrinho(() => carrinhoApi.updateItem(carrinho.id, item.id, quantidade));
    }

    function remover(item) {
        acaoCarrinho(() => carrinhoApi.removeItem(carrinho.id, item.id));
    }

    function limpar() {
        acaoCarrinho(() => carrinhoApi.clear(carrinho.id));
    }

    async function finalizar() {
        if (!window.confirm('Confirmar a finalização da venda?')) return;
        setCarregando(true);
        setMensagem(null);
        try {
            const dados = await vendaApi.create({
                carrinhoId: carrinho.id,
                formaPagamento,
                cliente: cliente || undefined,
            });
            setVendaFinalizada(dados.venda);
            setCliente('');
            setFormaPagamento('pix');
            await novoCarrinho();
        } catch (err) {
            setMensagem({ tipo: 'danger', texto: mensagemErro(err) });
        } finally {
            setCarregando(false);
        }
    }

    const produtosFiltrados = produtos.filter((p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="container my-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h1 className="fs-4 mb-0">Painel de Vendas</h1>
                <input className="form-control" style={{ maxWidth: 320 }} type="search"
                    placeholder="Buscar produto..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>

            {mensagem && <div className={`alert alert-${mensagem.tipo}`}>{mensagem.texto}</div>}

            {vendaFinalizada && (
                <div className="alert alert-success">
                    <h2 className="fs-5">Venda nº {vendaFinalizada.id} finalizada com sucesso!</h2>
                    <ul className="mb-2">
                        {vendaFinalizada.itens.map((item) => (
                            <li key={item.id}>
                                {item.quantidade}x {item.nomeProduto} — R$ {Number(item.subtotal).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <strong>Total: R$ {Number(vendaFinalizada.total).toFixed(2)}</strong>
                    <span className="ms-2 text-muted">({vendaFinalizada.formaPagamento.replace('_', ' ')})</span>
                    {vendaFinalizada.cliente && <span className="ms-2">Cliente: {vendaFinalizada.cliente}</span>}
                </div>
            )}

            <div className="row g-4">
                <div className="col-lg-8">
                    {produtosFiltrados.length === 0 ? (
                        <p className="text-muted">
                            {produtos.length === 0 ? 'Nenhum produto cadastrado. Cadastre em Produtos.' : 'Nenhum produto encontrado.'}
                        </p>
                    ) : (
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                            {produtosFiltrados.map((produto) => (
                                <div className="col" key={produto.id}>
                                    <ProdutoCard produto={produto} onAdicionar={adicionar}
                                        desabilitado={carregando || !carrinho} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-lg-4">
                    <div style={{ position: 'sticky', top: 16 }}>
                        <Carrinho
                            carrinho={carrinho}
                            carregando={carregando}
                            cliente={cliente}
                            setCliente={setCliente}
                            formaPagamento={formaPagamento}
                            setFormaPagamento={setFormaPagamento}
                            onAlterarQuantidade={alterarQuantidade}
                            onRemover={remover}
                            onLimpar={limpar}
                            onFinalizar={finalizar}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
