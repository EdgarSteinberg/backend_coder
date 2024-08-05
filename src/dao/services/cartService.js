import cartModel from '../../models/cartModel.js';

class CartService {

    async getAll() {
        return await cartModel.find().lean();
    }
    //Dejar el populate acordate q agregaste el lean funciona para la vista del carrito
    async getById(cid) {
        return await cartModel.findOne({ _id: cid }).populate('products.product').lean();
       //return await cartModel.findOne({ _id: cid }).populate('products.product');
    }

    async create() {
        return await cartModel.create({})
        // return await cartModel.create({ _id: uid, products: [] });
    }
    //Nuevaaaaa
    async updateCartWithUser(cid, uid) {
        return await cartModel.create(cid, uid);
    }

    async createProductInCart(cid, pid, update) {
        return await cartModel.findOneAndUpdate(cid, pid,update, { new: true })
    }

    async deleteProduct(cid, pid) {
        return await cartModel.findOneAndUpdate(cid, pid)
    }

    async updateInCart(cid, update) {
        return await cartModel.findOneAndUpdate(cid, update, { new: true })
    }

    async updateQuantity(cid, pid, quantity) {
        return await cartModel.findOneAndUpdate(cid, pid, quantity)
    }

    async removeProducts(cid, update) {
        return await cartModel.findByIdAndUpdate(cid, update, { new: true });
    }

}

export { CartService }


