import TicketModel from "../models/ticket.model.js";

class MongoTicketManager {
    constructor(){
        this.model=TicketModel
    }

    create = async (amount, purchaser) => { 
        return await TicketModel.create({amount,purchaser})
    }

    get = async () => {
        return await TicketModel.find().lean().exec()
    }
    
    getById = async (id) => {
        return await TicketModel.findById(id)
    }

    update = async (id, changes) => {
        return await TicketModel.updateOne({_id: id}, { $set: {changes} })
    }
    
    delete = async (id) => {
        return await TicketModel.deleteOne({ _id: id })
    }
    
}

export default MongoTicketManager