import { logger } from '../utlis/loggerDev.js';

export default class TicketServices {

    constructor(dao) {
        this.dao = dao;
    }
    
    async createTicket(cid, user) {
        try {
            return await this.dao.createTicket(cid, user);
        } catch (error) {
            logger.error(`Error creating ticket for cart ${cid} and user ${user}: ${error.message}`);
            throw error;
        }
    }
}