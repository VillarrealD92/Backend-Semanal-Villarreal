import { userService } from '../repositories/index.repositories.js';

export const updateUserToPremium = async (req, res) => {
    try {
        const userId = req.params.uid;
        const documents = req.files; 

     
        const user = await userService.getUserById(userId);
        const hasUploadedDocuments = user.documents &&
            user.documents.identification &&
            user.documents.addressProof &&
            user.documents.bankStatement;

      
        if (!hasUploadedDocuments) {
            return res.status(400).send("El usuario no ha terminado de cargar la documentación requerida.");
        }

       
        const updatedUser = await userService.updateUserToPremium(userId);

    
        const updatedUserWithDocuments = await userService.uploadUserDocuments(userId, documents);

   
        return res.status(200).json(updatedUserWithDocuments);
    } catch (error) {
        console.error("Error al actualizar usuario a premium o cargar documentos:", error);
        return res.status(500).send("Error interno del servidor al actualizar usuario a premium o cargar documentos.");
    }
};


export const uploadDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;
        const documents = req.files; 

      
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).send("Usuario no encontrado.");
        }

        const updatedUser = await userService.uploadUserDocuments(userId, documents);

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error al cargar documentos:", error);
        return res.status(500).send("Error interno del servidor al cargar documentos.");
    }
};

