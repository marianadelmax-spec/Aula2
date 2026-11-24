import api from "../util/api";

function useVenda() {
    async function create(venda) {
        const response = await api.post('/venda/create', venda);
        return response.data;
    }

    async function getAll() {
        const response = await api.get('/venda/getAll');
        return response.data;
    }

    async function getById(id) {
        const response = await api.get(`/venda/getByID/${id}`);
        return response.data;
    }

    return { create, getAll, getById };
}

export default useVenda;
