import { urlImagem } from '../../util/api';

const ProdutoCard = ({ produto, onAdicionar, desabilitado }) => {
    return (
        <div className="card h-100 shadow-sm">
            {produto.imagem ? (
                <img
                    src={urlImagem(produto.imagem)}
                    className="card-img-top"
                    alt={produto.nome}
                    style={{ height: 180, objectFit: 'cover' }}
                />
            ) : (
                <div className="card-img-top bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: 180 }}>
                    Sem imagem
                </div>
            )}
            <div className="card-body d-flex flex-column">
                <h5 className="card-title fs-6">{produto.nome}</h5>
                <p className="card-text fw-bold text-success fs-5 mb-3">
                    R$ {Number(produto.preco).toFixed(2)}
                </p>
                <button
                    className="btn btn-primary mt-auto"
                    onClick={() => onAdicionar(produto)}
                    disabled={desabilitado}
                >
                    Adicionar ao carrinho
                </button>
            </div>
        </div>
    )
}

export default ProdutoCard;
