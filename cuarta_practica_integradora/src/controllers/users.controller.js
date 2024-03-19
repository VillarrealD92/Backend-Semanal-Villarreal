import { userService } from '../repositories/index.repositories.js';

// Función para actualizar un usuario a premium
export const updateUserToPremium = async (req, res) => {
    try {
        const userId = req.params.uid;
        const documents = req.files; // Documentos subidos por el usuario

        // Verificar si el usuario ya ha cargado los documentos necesarios
        const user = await userService.getUserById(userId);
        const hasUploadedDocuments = user.documents &&
            user.documents.identification &&
            user.documents.addressProof &&
            user.documents.bankStatement;

        // Si el usuario no ha cargado los documentos necesarios, devolver un error
        if (!hasUploadedDocuments) {
            return res.status(400).send("El usuario no ha terminado de cargar la documentación requerida.");
        }

        // Actualizar el usuario a premium
        const updatedUser = await userService.updateUserToPremium(userId);

        // Actualizar los documentos del usuario en la base de datos
        const updatedUserWithDocuments = await userService.uploadUserDocuments(userId, documents);

        // Devolver la respuesta con el usuario actualizado
        return res.status(200).json(updatedUserWithDocuments);
    } catch (error) {
        console.error("Error al actualizar usuario a premium o cargar documentos:", error);
        return res.status(500).send("Error interno del servidor al actualizar usuario a premium o cargar documentos.");
    }
};

// Función para cargar documentos del usuario
export const uploadDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;
        const documents = req.files; // Documentos subidos por el usuario

        // Verificar si el usuario existe
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).send("Usuario no encontrado.");
        }

        // Actualizar los documentos del usuario en la base de datos
        const updatedUser = await userService.uploadUserDocuments(userId, documents);

        // Devolver la respuesta con el usuario actualizado
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error al cargar documentos:", error);
        return res.status(500).send("Error interno del servidor al cargar documentos.");
    }
};