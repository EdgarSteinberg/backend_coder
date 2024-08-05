import ProductDTO from "../dao/dto/productDTO.js";

export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getAll(query = {}, options = {}) {
        options.lean = true;
        return await this.dao.getAll(query, options)
    }

    async getById(pid) {
        return await this.dao.getById(pid)
    }

    async create(producto) {
        const newProduct = new ProductDTO(producto)
        return await this.dao.create(newProduct)
    }

    async productUpdate(id, producto) {
        return await this.dao.productUpdate(id, producto)
    }

    async productDelete(productId) {
        return await this.dao.productDelete(productId)
    }

    async updateProductStock(pid, quantity) {
        return await this.dao.updateProductStock(pid, quantity);
    }
}