import { urlImagem } from '../../util/api';

const formasPagamento = [
    { valor: 'pix', texto: 'Pix' },
    { valor: 'dinheiro', texto: 'Dinheiro' },
    { valor: 'cartao_credito', texto: 'Cartão de crédito' },
    { valor: 'cartao_debito', texto: 'Cartão de débito' },
];

const Carrinho = ({
    carrinho, carregando, cliente, setCliente, formaPagamento, setFormaPagamento,
    onAlterarQuantidade, onRemover, onLimpar, onFinalizar
}) => {
    const itens = carrinho?.itens?.filter((item) => item.produto) || [];
    const vazio = itens.length === 0;

    return (
        <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
                <strong>Carrinho</strong>
                <span className="badge bg-primary">{carrinho?.quantidadeItens || 0} itens</span>
            </div>

            <ul className="list-group list-group-flush">
                {vazio ? (
                    <li className="list-group-item text-center text-muted py-4">Seu carrinho está vazio</li>
                ) : (
                    itens.map((item) => (
                        <li key={item.id} className="list-group-item">
                            <div className="d-flex align-items-center gap-2">
                                {item.produto.imagem && (
                                    <img src={urlImagem(item.produto.imagem)} alt={item.produto.nome}
                                        style={{ width: 44, height: 44, objectFit: 'cover' }} className="rounded" />
                                )}
                                <div className="flex-grow-1">
                                    <div className="small fw-semibold">{item.produto.nome}</div>
                                    <div className="small text-muted">R$ {Number(item.produto.preco).toFixed(2)} cada</div>
                                </div>
                                <button className="btn btn-sm btn-link text-danger" title="Remover"
                                    onClick={() => onRemover(item)} disabled={carregando}>✕</button>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <div className="btn-group btn-group-sm">
                                    <button className="btn btn-outline-secondary" disabled={carregando || item.quantidade <= 1}
                                        onClick={() => onAlterarQuantidade(item, item.quantidade - 1)}>−</button>
                                    <span className="btn btn-outline-secondary disabled">{item.quantidade}</span>
                                    <button className="btn btn-outline-secondary" disabled={carregando}
                                        onClick={() => onAlterarQuantidade(item, item.quantidade + 1)}>+</button>
                                </div>
                                <span className="fw-semibold">R$ {Number(item.subtotal).toFixed(2)}</span>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            <div className="card-body border-top">
                <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                    <span>Total</span>
                    <span>R$ {Number(carrinho?.total || 0).toFixed(2)}</span>
                </div>

                <input className="form-control mb-2" type="text" placeholder="Nome do cliente (opcional)"
                    value={cliente} onChange={(e) => setCliente(e.target.value)} />

                <select className="form-select mb-3" value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value)}>
                    {formasPagamento.map((f) => (
                        <option key={f.valor} value={f.valor}>{f.texto}</option>
                    ))}
                </select>

                <button className="btn btn-success w-100 mb-2" disabled={vazio || carregando} onClick={onFinalizar}>
                    Finalizar venda
                </button>
                <button className="btn btn-outline-secondary w-100" disabled={vazio || carregando} onClick={onLimpar}>
                    Esvaziar carrinho
                </button>
            </div>
        </div>
    )
}

export default Carrinho;
