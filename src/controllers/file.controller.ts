
import { S3 } from 'aws-sdk';
import { HeadObjectRequest } from 'aws-sdk/clients/s3';
import config from 'config';
import exp from 'constants';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { s3, s3BucketName } from '../../config/aws-config';
import { UserFile } from '../entities/file.entity';
import { Folder } from '../entities/folder.entity';
import {
  CreateFileInput,
  DeleteFileInput,
  GetFileInput,
  GetUserFilesInput,
  UpdateFileInput
} from '../schemas/file.schema';
import { createFile, FileExistsInFolder, getFileById, getFileByName, getFiles, getUserFiles } from '../services/file.service';
import { getFolderById, getFolderByName } from '../services/folder.service';
import { findUserById } from '../services/user.service';
import AppError from '../utils/appError';

const uploadFileHandler = async (
    path: string,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  const file = req.file;
  if (!file) {
    return next(new AppError(400, 'No file uploaded.' ));
  }
  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200 MB
  if (!req.file || req.file.size > MAX_FILE_SIZE) {
    return next(new AppError(400, 'File size exceeds the limit.'));
  }
  const params = {
    Bucket: s3BucketName,
    Key: `${path}/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
  };
  // console.log("PARAMS CONFIGURED", params);

  const uploadOptions = {
    partSize: 10 * 1024 * 1024, // 10 MB part size
  };

  // console.log("OPTIONS CONFIGURED", uploadOptions);

  try {
    // console.log('uploading...');
    const result = await s3.upload(params, uploadOptions).promise();
    // console.log('done');
    return {fileUrl: result.Location };
  
} catch (error) {
    console.error('Error uploading to S3:', error);
    return next(new AppError(500, 'Failed to upload file to S3.'));
  }
};

export const createFileHandler = async (
    req: Request<{}, {}, CreateFileInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // const user = await findUserById(res.locals.user.id as string);
      // if file id is null, get the user's root file.
      const {folderId, userId} = req.body
  
      let parentFolder: Folder | null = null;
      if(!folderId){
          parentFolder = await getFolderByName(userId);
          //if parent file is null, create
          if(!parentFolder){
              return next(new AppError(400, 'Root folder not found for this user'))
          }
      }
      else{
          parentFolder = await getFolderById(folderId);
          if(!parentFolder){
              return next(new AppError(404, 'Parent folder not found'))
          }
      }

      //check file exists in the same directory
      if(await FileExistsInFolder(req.file?.originalname!, parentFolder.id)){
        return next(new AppError(400, 'File already exists in this folder!'))
      }

      const upload_path = `${parentFolder.path}/${parentFolder.name}`
      //upload file
      const uploadResult = await uploadFileHandler(upload_path, req, res, next);
      if(!uploadResult && !uploadResult!.fileUrl){
        return next(new AppError(500, 'An error occured with file creation'));
        }

      const newFile : Partial<UserFile> = {
          name: req.file?.originalname,
          url: uploadResult!.fileUrl,
          userId: userId,
          folderId: parentFolder.id
      }
      const file = await createFile(newFile);
  
      res.status(201).json({
        status: 'success',
        data: {
          post: file,
        },
      });
    } catch (err: any) {
      next(err);
    }
  };
  
  export const getAllFilesHandler = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
          const files = await getFiles();
  
          res.status(200).json({
              status: 'success',
              data: {
              files,
              },
          });
      } catch (err: any) {
        next(err);
      }
    };
  
  export const getFileHandler = async (
    req: Request<GetFileInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const file = await getFileById(req.params.fileId);
  
      if (!file) {
        return next(new AppError(404, 'File with that ID not found'));
      }

      // Add stream link if the file is streamable
      const fileType = file.url.split('.').pop();
      if(fileType && fileType == "mp4"){
        file.streamLink = `${config.get<string>('origin')}/video?id=${file.id}`;
      }
      if(fileType && fileType == "mp3"){
        file.streamLink = `${config.get<string>('origin')}/audio?id=${file.id}`;
      }
      res.status(200).json({
        status: 'success',
        data: {
          file,
        },
      });
    } catch (err: any) {
      next(err);
    }
  };
  
  export const getUserFileHandler = async (
    req: Request<GetUserFilesInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const files = await getUserFiles(req.params.userId);
  
      if (!files) {
        return next(new AppError(404, 'No file for this user'));
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          files,
        },
      });
    } catch (err: any) {
      next(err);
    }
  };
  
  
  
  export const updateFileHandler = async (
    req: Request<UpdateFileInput['params'], {}, UpdateFileInput['body']>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const file = await getFileById(req.params.fileId);
  
      if (!file) {
        return next(new AppError(404, 'Post with that ID not found'));
      }
  
      Object.assign(file, req.body);

      const updatedFile = await file.save();
  
      res.status(200).json({
        status: 'success',
        data: {
          post: updatedFile,
        },
      });
    } catch (err: any) {
      next(err);
    }
  };
  
  export const deleteFileHandler = async (
    req: Request<DeleteFileInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const file = await getFileById(req.params.fileId);
  
      if (!file) {
        return next(new AppError(404, 'File with that ID not found'));
      }
      
      //delete from s3;
      const key = file.url.split('s3.amazonaws.com/').pop();
      if (!key) {
        return next(new AppError(400, 'Bad file Url'));
      }
      try {
        await deleteFile(file.url);
      } catch (error) {
        return next(new AppError(500, 'Unable to delete file from server'));
      }
      await file.remove();
  
      res.status(200).json({
        status: 'success',
        data: `${file.name} Deleted successfully`,
      });
    } catch (err: any) {
      next(err);
    }
  };

  export const unsafeFileHandler = async (
    req: Request<DeleteFileInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const file = await getFileById(req.params.fileId);
  
      if (!file) {
        return next(new AppError(404, 'File with that ID not found'));
      }
      
      //delete from s3;
      const key = file.url.split('s3.amazonaws.com/').pop();
      if (!key) {
        return next(new AppError(400, 'Bad file Url'));
      }
      try {
        await deleteFile(file.url);
      } catch (error) {
        return next(new AppError(500, 'Unable to delete file from server'));
      }
      await file.remove();
  
      res.status(200).json({
        status: 'success',
        data: `${file.name} Deleted successfully`,
      });
    } catch (err: any) {
      next(err);
    }
  };
  
  export const fileStreamingHandler = async (
    req: Request<GetFileInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const file = await getFileById(req.params.fileId);
  
      if (!file) {
        return next(new AppError(404, 'File with that ID not found'));
      }
      const params: HeadObjectRequest = {
        Bucket: s3BucketName,
        Key: decodeURIComponent(file.url.split('s3.amazonaws.com/').pop()!)
      }
      
      try {
        // console.log(params);
        const headObject = await s3.headObject(params).promise();
    
        res.setHeader('Content-Length', headObject.ContentLength?.toString()!);
        res.setHeader('Content-Type', headObject.ContentType!);
    
        const stream = s3.getObject(params).createReadStream();
        stream.pipe(res);
      } catch (error) {
        console.error('Error retrieving file from S3:', error);
        return res.status(404).json({ error: 'File not found.' });
      }

    } catch (err: any) {
      next(err);
    }
  };

async function deleteFile(objectKey: string) {
    const params: S3.DeleteObjectRequest = {
      Bucket: s3BucketName,
      Key: objectKey //fileLink.split('s3.amazonaws.com/').pop()!, //Take the full path of the object;
    };
  
    try {
      // console.log(params);
      const data = await s3.deleteObject(params).promise();
      // console.log(`File deleted successfully: ${data}`);
    } catch (err) {
      // console.log(`File deletion error: ${err}`);
      throw err;
    }
  }
