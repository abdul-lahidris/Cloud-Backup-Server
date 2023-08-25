import express from 'express';
import {
  loginUserHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerUserHandler,
  revokeAccessTokenHandler,
  verifyEmailHandler,
} from '../controllers/auth.controller';
import { RoleEnumType } from '../entities/user.entity';
import { authorize } from '../middleware/authorize';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import {
  createUserSchema,
  loginUserSchema,
  revokeSessionSchema,
  verifyEmailSchema,
} from '../schemas/user.schema';

const router = express.Router();

// Register user
router.post('/register', validate(createUserSchema), registerUserHandler);

// Login user
router.post('/login', validate(loginUserSchema), loginUserHandler);

// Logout user
router.get('/logout', authorize, requireUser, logoutHandler);

// Refresh access token
router.get('/refresh', refreshAccessTokenHandler);

// Refresh access token
router.post('/revoke/',authorize([RoleEnumType.ADMIN]), validate(revokeSessionSchema), revokeAccessTokenHandler);

// Verify Email Address
router.get(
  '/verifyemail/:verificationCode',
  validate(verifyEmailSchema),
  verifyEmailHandler
);

export default router;
