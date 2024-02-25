export default class TicketServices {

    constructor(dao){
        this.dao= dao
    }
    
    createTicket = async (cid, user) => {return this.dao.createTicket(cid, user)}
}