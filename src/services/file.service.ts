import { Request } from 'express';
import { UserFile } from '../entities/file.entity';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../utils/data-source';

const fileRepository = AppDataSource.getRepository(UserFile);

export const createFile = async (input: Partial<UserFile>) => {
  return await fileRepository.save(fileRepository.create(input));
};

export const getFileById = async (fileId: string) => {
  return await fileRepository.findOneBy({ id: fileId });
};

export const getFileByName = async (fileName: string) => {
    return await fileRepository.findOneBy({ name: fileName, deleted: false });
  };

export const getPendingUnsafeFiles = async () => {
  return await fileRepository.findOneBy({ isUnsafe: true, deleted: false });
};

export const FileExistsInFolder = async (fileName: string, folderId: string) => {
    const file = await fileRepository.findOneBy({ name: fileName, folderId: folderId, deleted: false });
    return file ? true : false;
  };

export const getFiles = async () => {
    return await fileRepository.createQueryBuilder("file")
    .where({deleted: false})
    .getMany();
  };

export const getUserFiles = async (user: string) => {
    return await fileRepository.createQueryBuilder("file")
    .where({userId: user, deleted: false})
    .getMany();
  };