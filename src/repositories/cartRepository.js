import CartDTO from "../dao/dto/cartDTO.js";

export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }
    async getAll() {
        return await this.dao.getAll()
    }

    async getById(cid) {
        return await this.dao.getById(cid)
    }

    async create(uid) {
        return await this.dao.create(uid);
    }

    async createProductInCart(cid, pid, update) {
        return await this.dao.createProductInCart(cid, pid, update)
    }

    async deleteProduct(cid, pid) {
        return await this.dao.deleteProduct(cid, pid)
    }
    async updateInCart(cid, update) {
        return await this.dao.updateInCart(cid, update)
    }

    async updateQuantity(cid, pid, quantity) {
        return await this.dao.updateQuantity(cid, pid, quantity)
    }

    async removeProducts(cid, update) {
        return await this.dao.removeProducts(cid, update);
    }


}