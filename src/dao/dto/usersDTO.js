export default class usersDTO {
    constructor({first_name, last_name,email, role}){
        this.first_name = first_name || email,
        this.last_name = last_name || email,
        this.email = email,
        this.role = role
    }
}