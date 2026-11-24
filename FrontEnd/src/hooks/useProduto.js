import api from "../util/api";

// monta o FormData para enviar nome, preço e imagem (multipart)
function montarFormData(produto) {
    const formData = new FormData();
    formData.append('nome', produto.nome);
    formData.append('preco', produto.preco);
    if (produto.imagem) {
        formData.append('imagem', produto.imagem);
    }
    return formData;
}

function useProduto() {
    async function getAll() {
        const response = await api.get('/produto/getAll');
        return response.data;
    }

    async function getById(id) {
        const response = await api.get(`/produto/getByID/${id}`);
        return response.data;
    }

    async function create(produto) {
        const response = await api.post('/produto/create', montarFormData(produto));
        return response.data;
    }

    async function update(id, produto) {
        const response = await api.put(`/produto/update/${id}`, montarFormData(produto));
        return response.data;
    }

    async function remove(id) {
        const response = await api.delete(`/produto/delete/${id}`);
        return response.data;
    }

    return { getAll, getById, create, update, remove, };
}

export default useProduto;
