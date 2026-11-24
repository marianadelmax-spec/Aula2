import api from "../util/api";

function useCarrinho() {
    async function create() {
        const response = await api.post('/carrinho/create');
        return response.data.carrinho;
    }

    async function getById(id) {
        const response = await api.get(`/carrinho/getByID/${id}`);
        return response.data;
    }

    async function addItem(id, produtoId, quantidade = 1) {
        const response = await api.post(`/carrinho/addItem/${id}`, { produtoId, quantidade });
        return response.data.carrinho;
    }

    async function updateItem(id, itemId, quantidade) {
        const response = await api.put(`/carrinho/updateItem/${id}/${itemId}`, { quantidade });
        return response.data.carrinho;
    }

    async function removeItem(id, itemId) {
        const response = await api.delete(`/carrinho/removeItem/${id}/${itemId}`);
        return response.data.carrinho;
    }

    async function clear(id) {
        const response = await api.delete(`/carrinho/clear/${id}`);
        return response.data.carrinho;
    }

    return { create, getById, addItem, updateItem, removeItem, clear };
}

export default useCarrinho;
