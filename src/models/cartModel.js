import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    // products: [{
    //     product: {
    //         type: mongoose.Schema.Types.ObjectId, // Asegúrate de que solo sea ObjectId
    //         ref: 'products'
    //     },
    //     quantity: {
    //         type: Number,
    //         //default: 1
    //     },
       
    // }],
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId, // Asegúrate de que solo sea ObjectId
                ref: 'products'
            },
            quantity: {
                type: Number,
                default: 1 // Valor por defecto para la cantidad
            }
        }],
        default: [] // Valor por defecto para el array de productos
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