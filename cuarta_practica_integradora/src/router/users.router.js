import express from 'express';
import upload from '../utils/multer.js';
import { updateUserToPremium, uploadDocuments } from '../controllers/users.controller.js';

const router = express.Router();

// Ruta para actualizar a un usuario a premium
router.post('/:uid/premium', updateUserToPremium);

// Ruta para subir documentos de un usuario
router.post('/:uid/documents', upload.array('documents'), uploadDocuments);

export default router;