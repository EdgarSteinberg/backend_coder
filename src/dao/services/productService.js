import productModel from "../../models/productModel.js";

class ProductService {

    async getAll(query = {}, options = {}) {
        options.lean = true;
        return await productModel.paginate(query, options);
    }

    async getById(pid) {
        return await productModel.findOne({ _id: pid });
    }

    async create(producto) {
        return await productModel.create(producto);
    }

    async productUpdate(id, producto) {
        return await productModel.updateOne({ _id: id }, producto);
    }

    async productDelete(productId) {
        return await productModel.deleteOne({ _id: productId });
    }

    async updateProductStock(pid, quantity) {
        return await productModel.updateOne({ _id: pid }, { $inc: { stock: -quantity } });
    }
}

export { ProductService };
