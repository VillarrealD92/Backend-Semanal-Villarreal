import { messageModel } from "./models/message.model.js";

class MessageManagerDB {

    async sendMessages() {
        try {
            const messages = await messageModel.find();
            return messages;
        } catch (error) {
            return [];
        }
    }
    async addMessage(Newmessage) {
        const { user, message} = Newmessage;

        if (!user || !message) {
            return 'Error creating the message';
        }

        const newMessage = {
            user,
            message,
        }

        try {
            const result = await messageModel.create(newMessage);

            return 'Mensage creado correctamente';
        } catch (error) {
            return 'Error creating the mensage';
        }
    }
}

export default MessageManagerDB