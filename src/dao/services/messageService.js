import messageModel from '../../models/messagesModel.js';


class MessageService {

    async getAll() {
        try{
            return await messageModel.find().lean();
        }catch (error){
            console.error(error.message)
            throw new Error('Error al buscar el mensaje')
        }
    }

    async createMessage(userData){
        try{
            return await messageModel.create(userData);
        }catch(error){
            console.error(error.message)
            throw new Error('Error al crear el mensaje')
        }
    }
}

export { MessageService }