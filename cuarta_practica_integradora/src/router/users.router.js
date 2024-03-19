import express from 'express';
import upload from '../utils/multer.js';
import { updateUserToPremium, uploadDocuments } from '../controllers/users.controller.js';

const router = express.Router();

router.post('/:uid/premium', updateUserToPremium);

router.post('/:uid/documents', upload.array('documents'), uploadDocuments);

export default router;