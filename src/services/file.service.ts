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
    return await fileRepository.findOneBy({ name: fileName });
  };

export const FileExistsInFolder = async (fileName: string, folderId: string) => {
    const file = await fileRepository.findOneBy({ name: fileName, folderId: folderId });
    return file ? true : false;
  };

export const getFiles = async () => {
    return await fileRepository.createQueryBuilder("file")
    .getMany();
  };

export const getUserFiles = async (user: string) => {
    return await fileRepository.createQueryBuilder("file")
    .where({userId: user})
    .getMany();
  };