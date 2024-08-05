import mongoose from 'mongoose';

const ticketCollection = 'ticket'

const ticketSchema = mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type: Number
    },
    purchaser: {
        type: String
    }
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;