import express from 'express';
// import { uploadFileHandler } from '../controllers/file.controller';
import {
  createFileHandler,
  getFileHandler,
  getUserFileHandler,
  updateFileHandler,
  deleteFileHandler,
  getAllFilesHandler,
} from '../controllers/file.controller';
import { authorize } from '../middleware/authorize';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import {
  createFileSchema,
  getFileByIdSchema,
  getFileByUserIdSchema,
  updateFileSchema,
  deleteFileSchema
} from '../schemas/file.schema';

import multer from 'multer';
import { RoleEnumType } from '../entities/user.entity';
const upload = multer();


const router = express.Router();
router.use(authorize([]), requireUser);
// create file
router.post('/create', upload.single('file'), createFileHandler);
// router.post('/create', validate(createFileSchema), createFileHandler);

// update file
router.patch('/update/:fileId', validate(updateFileSchema), authorize([RoleEnumType.USER]), updateFileHandler);

// Get file by id
router.get('/', authorize([RoleEnumType.ADMIN]), getAllFilesHandler);
router.get('/:fileId', validate(getFileByIdSchema), getFileHandler);
// router.get('/stream/:fileId', validate(getFileByIdSchema), getFileHandler);

// Get file by id
router.get('/user/:userId', validate(getFileByUserIdSchema), getUserFileHandler);

// Delete file
router.delete('/:fileId', validate(deleteFileSchema), authorize([RoleEnumType.USER]), deleteFileHandler);

// Mark file as unsafe
router.delete('/unsafe/:fileId', validate(deleteFileSchema), authorize([RoleEnumType.ADMIN]), deleteFileHandler);


export default router;
