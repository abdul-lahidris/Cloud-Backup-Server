import { Request } from 'express';
import { FileApproval } from '../entities/fileApproval.entity';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../utils/data-source';

const fileApprovalRepository = AppDataSource.getRepository(FileApproval);

export const createFileApproval = async (input: Partial<FileApproval>) => {
  return await fileApprovalRepository.save(fileApprovalRepository.create(input));
};

export const getFileApprovalById = async (fileApprovalId: string) => {
  return await fileApprovalRepository.findOneBy({ id: fileApprovalId });
};


export const getFileApprovals = async () => {
    return await fileApprovalRepository.createQueryBuilder("fileApproval")
    .getMany();
  };

export const adminHasApproved = async (user: string, file: string) => {
    const approval = await fileApprovalRepository.findOneBy({ userId: user, fileId: file })
    return approval ? true : false;
};

export const getFileHistoriesByFile = async (file: string) => {
return await fileApprovalRepository.createQueryBuilder("fileApproval")
.where({fileId: file})
.getMany();
};

export const getAdminFileApprovals = async (user: string) => {
    return await fileApprovalRepository.createQueryBuilder("fileApproval")
    .where({userId: user})
    .getMany();
  };