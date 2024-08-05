export default class UserDTO {
    constructor({ _id, first_name, last_name, email, age, username, password }) {
        this.id = _id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.age = age;
        this.username = username || last_name; // Si no se proporciona un username, usa el last_name como username
        this.password = password
    }
}

