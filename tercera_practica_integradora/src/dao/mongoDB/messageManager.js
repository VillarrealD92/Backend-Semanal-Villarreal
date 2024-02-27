import { messageModel } from "./models/message.model.js";
import { logger } from "../../utlis/loggerDev.js"; 

class MessageManagerDB {

    async sendMessages() {
        try {
            const messages = await messageModel.find();
            return messages;
        } catch (error) {
            logger.error("Error in sendMessages: " + error.message); 
            return [];
        }
    }

    async addMessage(Newmessage) {
        const { user, message } = Newmessage;

        if (!user || !message) {
            logger.error("Error in addMessage: Invalid message"); 
            return 'Error creating the message';
        }

        const newMessage = {
            user,
            message,
        }

        try {
            const result = await messageModel.create(newMessage);
            logger.info("Message added successfully"); 
            return 'Mensaje creado correctamente';
        } catch (error) {
            logger.error("Error in addMessage: " + error.message);
            return 'Error creating the message';
        }
    }
}

export default MessageManagerDB;