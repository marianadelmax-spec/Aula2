import { useEffect, useRef, useState } from "react";
import InputGroup from "../../Components/inputGroup";
import useProduto from "../../hooks/useProduto";
import { urlImagem, mensagemErro } from "../../util/api";

const produtoVazio = { nome: '', preco: '', imagem: null };
const extensoesPermitidas = ['.jpeg', '.jpg', '.png'];
const tiposPermitidos = ['image/jpeg', 'image/png'];

const Produto = () => {
    const [produto, setProduto] = useState(produtoVazio);
    const [lstProdutos, setlstProdutos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [imagemAtual, setImagemAtual] = useState(null);
    const [mensagem, setMensagem] = useState(null);
    const inputImagemRef = useRef(null);
    const { getAll, create, update, remove } = useProduto();

    async function carregarProdutos() {
        try {
            const dados = await getAll();
            setlstProdutos(dados);
        } catch (err) {
            setMensagem({ tipo: 'danger', texto: mensagemErro(err, 'Não foi possível carregar os produtos.') });
        }
    }

    useEffect(() => {
        carregarProdutos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function validarImagem(arquivo) {
        if (!arquivo) return true;
        const nome = arquivo.name.toLowerCase();
        const extensaoOk = extensoesPermitidas.some((ext) => nome.endsWith(ext));
        return extensaoOk && tiposPermitidos.includes(arquivo.type);
    }

    function validateProduto(produto) {
        if (!produto.nome) {
            alert("O campo nome é obrigatório");
            return false;
        }
        if (produto.preco === '' || produto.preco === null) {
            alert("O campo preço é obrigatório");
            return false;
        }
        if (Number(produto.preco) < 0) {
            alert("O preço não pode ser negativo");
            return false;
        }
        if (!validarImagem(produto.imagem)) {
            alert("Formato de imagem inválido. Envie apenas arquivos .jpeg ou .png");
            return false;
        }
        return true;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        // bloqueia o sinal de negativo no preço
        if (name === 'preco' && value !== '' && Number(value) < 0) {
            return;
        }
        setProduto({ ...produto, [name]: value });
    }

    function handleImagem(e) {
        const arquivo = e.target.files[0] || null;
        if (arquivo && !validarImagem(arquivo)) {
            alert("Formato de imagem inválido. Envie apenas arquivos .jpeg ou .png");
            e.target.value = '';
            setProduto({ ...produto, imagem: null });
            return;
        }
        setProduto({ ...produto, imagem: arquivo });
    }

    function limparFormulario() {
        setProduto(produtoVazio);
        setEditandoId(null);
        setImagemAtual(null);
        if (inputImagemRef.current) inputImagemRef.current.value = '';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateProduto(produto)) return;

        try {
            const dados = editandoId
                ? await update(editandoId, produto)
                : await create(produto);
            setMensagem({ tipo: 'success', texto: dados.message });
            limparFormulario();
            carregarProdutos();
        } catch (err) {
            setMensagem({ tipo: 'danger', texto: mensagemErro(err) });
        }
    }

    function handleEditar(item) {
        setEditandoId(item.id);
        setProduto({ nome: item.nome, preco: item.preco, imagem: null });
        setImagemAtual(item.imagem);
        if (inputImagemRef.current) inputImagemRef.current.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleDeletar(item) {
        if (!window.confirm(`Deseja deletar o produto "${item.nome}"?`)) return;
        try {
            const dados = await remove(item.id);
            setMensagem({ tipo: 'success', texto: dados.message });
            if (editandoId === item.id) limparFormulario();
            carregarProdutos();
        } catch (err) {
            setMensagem({ tipo: 'danger', texto: mensagemErro(err) });
        }
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center fs-4">{editandoId ? 'Editar Produto' : 'Produto'}</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <InputGroup
                        label="nome"
                        onChange={handleChange}
                        type="text"
                        placeholder="Nome do produto"
                        name="nome"
                        value={produto.nome}
                    />
                    <InputGroup
                        label="preço"
                        onChange={handleChange}
                        type="number"
                        placeholder="Preço do produto"
                        name="preco"
                        value={produto.preco}
                        min="0"
                        step="0.01"
                    />
                    <InputGroup
                        label="imagem"
                        onChange={handleImagem}
                        type="file"
                        name="imagem"
                        accept=".jpeg,.jpg,.png,image/jpeg,image/png"
                        inputRef={inputImagemRef}
                    />
                    <p className="form-text mt-n2">Apenas imagens .jpeg ou .png</p>

                    {editandoId && imagemAtual && !produto.imagem && (
                        <div className="mb-3">
                            <small className="text-muted d-block">Imagem atual:</small>
                            <img src={urlImagem(imagemAtual)} alt={produto.nome} style={{ height: 80 }} className="rounded border" />
                        </div>
                    )}

                    <button className="btn btn-primary" type="submit">
                        {editandoId ? 'Atualizar' : 'Salvar'}
                    </button>
                    {editandoId && (
                        <button className="btn btn-secondary ms-2" type="button" onClick={limparFormulario}>
                            Cancelar
                        </button>
                    )}
                </form>
            </div>

            {mensagem && (
                <div className={`alert alert-${mensagem.tipo} mt-3 mb-0`} role="alert">
                    {mensagem.texto}
                </div>
            )}

            <table className="table table-striped mt-3 align-middle">
                <thead>
                    <tr>
                        <th>Imagem</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th className="text-end">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {lstProdutos.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center">Nenhum produto cadastrado</td>
                        </tr>)
                        : (
                            lstProdutos.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.imagem
                                            ? <img src={urlImagem(item.imagem)} alt={item.nome} style={{ width: 60, height: 60, objectFit: 'cover' }} className="rounded" />
                                            : <span className="text-muted small">Sem imagem</span>}
                                    </td>
                                    <td>{item.nome}</td>
                                    <td>R$ {Number(item.preco).toFixed(2)}</td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(item)}>Editar</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletar(item)}>Deletar</button>
                                    </td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Produto;
