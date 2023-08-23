import { NextFunction, Request, Response } from 'express';
import { RoleEnumType, User } from '../entities/user.entity';
import { CreateUserInput, GetUserByIdInput } from '../schemas/user.schema';
import { createUser, findUserById } from '../services/user.service';
import AppError from '../utils/appError';

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    res.status(200).status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getByIdHandler = async (
  req: Request<GetUserByIdInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(req.params.userId);

    if (!user) {
        return next(new AppError(404, 'user with that ID not found'));
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err: any) {
      next(err);
    }
};

export const CreateAdminUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, password, email } = req.body;

    const newUser = await createUser({
      name,
      email: email.toLowerCase(),
      password: password,
      verified : true,
      role: RoleEnumType.ADMIN
    });

    // const { hashedVerificationCode, verificationCode } =
    //   User.createVerificationCode();
    // newUser.verificationCode = hashedVerificationCode;
    await newUser.save();

    // try {
    //   await new Email(newUser, redirectUrl).sendVerificationCode();

    res.status(201).json({
      status: 'success',
      message:
        'Admin User Created Successfully',
    });
    // } catch (error) {
    //   newUser.verificationCode = null;
    //   await newUser.save();

    //   return res.status(500).json({
    //     status: 'error',
    //     message: 'There was an error sending email, please try again',
    //   });
    // }
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'User with that email already exist',
      });
    }
    next(err);
  }
};

