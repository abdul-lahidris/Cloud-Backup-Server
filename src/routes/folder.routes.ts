import express from 'express';
import {
  createFolderHandler,
  getFolderHandler,
  getUserFolderHandler,
  updateFolderHandler,
  deleteFolderHandler,
  getAllFoldersHandler,
} from '../controllers/folder.controller';
import { RoleEnumType } from '../entities/user.entity';
import { authorize } from '../middleware/authorize';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import {
  createFolderSchema,
  getFolderByIdSchema,
  getFolderByUserIdSchema,
  updateFolderSchema,
  deleteFolderSchema
} from '../schemas/folder.schema';

const router = express.Router();
router.use(authorize([]), requireUser);
// create folder
router.post('/create', validate(createFolderSchema), createFolderHandler);

// update folder
router.patch('/update/:folderId', validate(updateFolderSchema), updateFolderHandler);

// Get folder by id
router.get('/', authorize([RoleEnumType.ADMIN]), getAllFoldersHandler);
router.get('/:folderId', validate(getFolderByIdSchema), getFolderHandler);

// Get user folders by user id
router.get('/user/:userId', validate(getFolderByUserIdSchema), getUserFolderHandler);

// Refresh access token
router.delete('/:folderId', validate(deleteFolderSchema), deleteFolderHandler);


export default router;
