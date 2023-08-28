import express from 'express';
// import { uploadFileHandler } from '../controllers/file.controller';
import {
  createFileHandler,
  getFileHandler,
  getUserFileHandler,
  updateFileHandler,
  deleteFileHandler,
  getAllFilesHandler,
  compressFileHandler,
  getAllHistoryHandler,
  getHistoryByFileIdHandler,
  getUserFileHistoryHandler,
  unsafeFileHandler,
  ApproveUnsafeFileHandler,
  moveFileHandler,
  renameFileHandler,
  copyFileHandler,
} from '../controllers/file.controller';
import { authorize } from '../middleware/authorize';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import {
  createFileSchema,
  getFileByIdSchema,
  getFileByUserIdSchema,
  updateFileSchema,
  deleteFileSchema,
  compressFileSchema,
  moveFileSchema,
  renameFileSchema,
  copyFileSchema
} from '../schemas/file.schema';

import multer from 'multer';
import { RoleEnumType } from '../entities/user.entity';
import { getHistoryByFileIdSchema, getUserFileHistorySchema } from '../schemas/fileHistory.schema';
const upload = multer();


const router = express.Router();
router.use(authorize([]), requireUser);
// create file
router.post('/create', upload.single('file'), createFileHandler);
// router.post('/create', validate(createFileSchema), createFileHandler);

// update file
router.patch('/update/:fileId', validate(updateFileSchema), authorize([RoleEnumType.USER]), updateFileHandler);// update file
router.post('/move/:fileId', validate(moveFileSchema), authorize([RoleEnumType.USER]), moveFileHandler);// move file
router.post('/rename/:fileId', validate(renameFileSchema), authorize([RoleEnumType.USER]), renameFileHandler);// rename file
router.post('/copy/:fileId', validate(copyFileSchema), authorize([RoleEnumType.USER]), copyFileHandler); // copy file

// Get file by id
router.get('/', authorize([RoleEnumType.ADMIN]), getAllFilesHandler);
router.get('/:fileId', validate(getFileByIdSchema), getFileHandler);
// router.get('/stream/:fileId', validate(getFileByIdSchema), getFileHandler);

// Get file by id
router.get('/user/:userId', validate(getFileByUserIdSchema), getUserFileHandler);

// Delete file
router.delete('/:fileId', validate(deleteFileSchema), authorize([RoleEnumType.USER]), deleteFileHandler);

// Mark file as unsafe
router.post('/unsafe/:fileId', validate(deleteFileSchema), authorize([RoleEnumType.ADMIN]), unsafeFileHandler);

// Approve marked file for deletion
router.post('/unsafe/approve/:fileId', validate(deleteFileSchema), authorize([RoleEnumType.ADMIN]), ApproveUnsafeFileHandler);

// compress files
router.post('/compress', validate(compressFileSchema), compressFileHandler);

// Get all files histories
router.get('/history/all', authorize([RoleEnumType.ADMIN]), getAllHistoryHandler);
// Get a file's history
router.get('/history/file/:fileId/', validate(getHistoryByFileIdSchema), getHistoryByFileIdHandler);
// Get a user's file history
router.get('/history/user/:userId', validate(getUserFileHistorySchema), getUserFileHistoryHandler);

export default router;
