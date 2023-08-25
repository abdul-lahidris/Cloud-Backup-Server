import { Request } from 'express';
import { FileHistory } from '../entities/fileHistory.entity';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../utils/data-source';

const fileHistoryRepository = AppDataSource.getRepository(FileHistory);

export const createFileHistory = async (input: Partial<FileHistory>) => {
  return await fileHistoryRepository.save(fileHistoryRepository.create(input));
};

export const getFileHistoryById = async (fileHistoryId: string) => {
  return await fileHistoryRepository.findOneBy({ id: fileHistoryId });
};


export const getFileHistories = async () => {
    return await fileHistoryRepository.createQueryBuilder("fileHistory")
    .getMany();
  };

export const getFileHistoriesByFile = async (file: string) => {
return await fileHistoryRepository.createQueryBuilder("fileHistory")
.where({fileId: file})
.getMany();
};

export const getUserFileHistories = async (user: string) => {
    return await fileHistoryRepository.createQueryBuilder("fileHistory")
    .where({userId: user})
    .getMany();
  };