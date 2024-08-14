import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'products'
            },
            quantity: {
                type: Number,
                default: 1 
            }
        }],
        default: [] 
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users"
    }
});
//Con el middleware pre
cartSchema.pre("find", function () {
    this.populate("products.product")
})

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;