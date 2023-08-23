import { NextFunction, Request, Response } from 'express';
import { Folder } from '../entities/folder.entity';
import {
  CreateFolderInput,
  DeleteFolderInput,
  GetFolderInput,
  GetUserFoldersInput,
  UpdateFolderInput
} from '../schemas/folder.schema';
import { createFolder, getFolderById, getFolderByName, getFolders, getUserFolders } from '../services/folder.service';
import { findUserById } from '../services/user.service';
import AppError from '../utils/appError';

export const createFolderHandler = async (
  req: Request<{}, {}, CreateFolderInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // const user = await findUserById(res.locals.user.id as string);
    // if folder id is null, get the user's root folder.
    const {name, folderId, userId} = req.body

    let parentFolder: Folder | null = null;
    if(!folderId){
        parentFolder = await getFolderByName(userId);
        //if parent folder is null, create
        if(!parentFolder){
          try {
            parentFolder = await createFolder({
              name: userId,
              path: "root",
              userId: userId
            });
          } catch (error) {
            return next(new AppError(400, 'Parent root Folder not found, unable to recreate'))
          }
        }
    }
    else{
        parentFolder = await getFolderById(folderId);
        if(!parentFolder){
            return next(new AppError(404, 'Parent Folder not found'))
        }
    }
    const newFolder : Partial<Folder> = {
        name: name,
        path: `${parentFolder.path}/${parentFolder.name}`,
        userId: userId
    }
    const folder = await createFolder(newFolder);

    res.status(201).json({
      status: 'success',
      data: {
        post: folder,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllFoldersHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const folders = await getFolders();

        res.status(200).json({
            status: 'success',
            data: {
            folders,
            },
        });
    } catch (err: any) {
      next(err);
    }
  };

export const getFolderHandler = async (
  req: Request<GetFolderInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getFolderById(req.params.folderId);

    if (!post) {
      return next(new AppError(404, 'Folder with that ID not found'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getUserFolderHandler = async (
  req: Request<GetUserFoldersInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const folders = await getUserFolders(req.params.userId);

    if (!folders) {
      return next(new AppError(404, 'No folder for this user'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        folders,
      },
    });
  } catch (err: any) {
    next(err);
  }
};



export const updateFolderHandler = async (
  req: Request<UpdateFolderInput['params'], {}, UpdateFolderInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const folder = await getFolderById(req.params.folderId);

    if (!folder) {
      return next(new AppError(404, 'Post with that ID not found'));
    }

    Object.assign(folder, req.body);

    const updatedFolder = await folder.save();

    res.status(200).json({
      status: 'success',
      data: {
        post: updatedFolder,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteFolderHandler = async (
  req: Request<DeleteFolderInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const folder = await getFolderById(req.params.folderId);

    if (!folder) {
      return next(new AppError(404, 'Folder with that ID not found'));
    }
    if (folder.path == 'root') {
      return next(new AppError(400, 'Cannot delete root folder'));
    }

    await folder.remove();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};
