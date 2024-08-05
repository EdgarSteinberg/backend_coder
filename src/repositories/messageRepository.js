import MessageDTO from '../dao/dto/messageDTO.js'


export default class MessageRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAllMessages() {
        return await this.dao.getAll();
    }

    async createMessage(userData) {
        const newMessage = new MessageDTO(userData)
        return await this.dao.createMessage(newMessage);
    }
}
