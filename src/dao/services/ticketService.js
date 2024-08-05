import ticketModel from "../../models/ticketModel.js";

class TicketService {

    async getAll() {
        try {
            return await ticketModel.find().lean()
        } catch (error) {
            console.log(error.message);
            throw new Error('Error al consolutar los tickets')
        }
    }

    async getTicketById(tid) {
        try {
            return await ticketModel.findOne({ _id: tid })
        } catch (error) {
            console.error(error.message);
            throw new Error(`El ticket con ID : ${tid} no existe`)
        }

    }

    async createTicket(ticket) {
        try {
            const result = await ticketModel.create(ticket)
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error('Error al crear el ticket')
        }
    }
}

export { TicketService }