import express from 'express';
import { CreateAdminUserHandler, getByIdHandler, getMeHandler } from '../controllers/user.controller';
import { RoleEnumType } from '../entities/user.entity';
import { authorize } from '../middleware/authorize';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { createUserSchema, getByIdSchema } from '../schemas/user.schema';

const router = express.Router();

router.use(authorize([]), requireUser);

// Get currently logged in user
router.get('/current', getMeHandler);

// Get UserById
router.get('/id/:userId', validate(getByIdSchema), authorize([RoleEnumType.ADMIN, RoleEnumType.USER]), getByIdHandler);

// Create Admin User
// router.post('/create/admin', validate(createUserSchema), authorize([RoleEnumType.ADMIN]), CreateAdminUserHandler);
router.post('/create/admin', validate(createUserSchema), CreateAdminUserHandler);

export default router;
