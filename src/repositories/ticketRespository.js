import TicketDTO from "../dao/dto/ticketDTO.js"

export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getAll() {
        return await this.dao.getAll()
    }

    async getTicketById(tid) {
        return await this.dao.getTicketById(tid)
    }

    async createTicket(ticket) {
        const { code, purchase_datetime, amount, purchaser } = ticket;
        const newTicket = new TicketDTO(code, purchase_datetime, amount, purchaser);
        return await this.dao.createTicket(newTicket)
        //return await this.dao.createTicket(ticket)
    }
}