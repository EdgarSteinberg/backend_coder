export default class CurrentDTO {
    constructor(user) {
        this._id = "anonymized_id"; // Anonimizamos el ID
        this.first_name = user.first_name; // Mantener nombre real
        this.last_name = user.last_name; // Mantener apellido real
        this.email = user.email; // Mantener correo electrónico real
        this.age = user.age; // Mantener la edad real
        this.username = user.username; // Mantener el nombre de usuario real
        this.role = "anonymized_role"; // Anonimizamos el rol
        this.cart = user.cart; // Mantener el carrito de compras real
        this.__v = 0; // Anonimizamos __v
        this.iat = "anonymized_iat"; // Anonimizamos iat
        this.exp = "anonymized_exp"; // Anonimizamos exp
    }
}
