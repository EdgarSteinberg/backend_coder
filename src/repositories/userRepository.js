import UserDTO from "../dao/dto/userDTO.js"
import userDTO from '../dao/dto/usersDTO.js'

export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getAll() {
        return await this.dao.getAll();
    }

    async getAllNew() {
        const users = await this.dao.getAllNew();
        return users.map(user => new userDTO(user))
    }

    async getById(uid) {
        return await this.dao.getById(uid)
    }

    async createRegister(user) {
        const newRegister = new UserDTO(user)
        return await this.dao.createRegister(newRegister)
    }

    async createLogin(email, password) {
        return await this.dao.createLogin(email)
    }


    async updateUser(uid, updateData) {
        return await this.dao.updateUser(uid, updateData);
    }

    async getEmail(email) {
        return await this.dao.getEmail(email)
    }

    async updateLastConnection(email) {
        return await this.dao.updateLastConnection(email);
    }

    async uploadDocuments(uid, documents) {
        return await this.dao.uploadDocuments(uid, documents);
    }

    async getInactiveUsers(lastConnectionDate) {
        return await this.dao.getInactiveUsers(lastConnectionDate);
    }

    async deleteUserById(email) {
        return await this.dao.deleteUserById(email);
    }

}