import { Router } from 'express';
import { TicketController } from '../controllers/ticketController.js';
import addLogger from '../logger.js';
const TicketRouter = Router();
const Ticket = new TicketController();

TicketRouter.get('/', addLogger, async (req, res) => {
    try {
        const result = await Ticket.getAllTickets();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.error(`Error al buscar los tickets: ${error.message}`)
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});


TicketRouter.get('/:tid', addLogger, async (req, res) => {
    try {
        const { tid } = req.params;
        const result = await Ticket.getTicketById(tid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.error(`Error al obtener el ticket ID: ${req.params.tid} ${error.message}`);

        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

TicketRouter.post('/', addLogger, async (req, res) => {
    try {

        const result = await Ticket.createTicket(req.body)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        req.logger.error(`Error al crear el ticket}: ${error.message}`);
        res.status(400).send({
            error: 'error',
            message: error.message
        });
    }
});

export default TicketRouter;