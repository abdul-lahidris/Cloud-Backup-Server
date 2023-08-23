import { Request } from 'express';
import { Folder } from '../entities/folder.entity';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../utils/data-source';

const folderRepository = AppDataSource.getRepository(Folder);

export const createFolder = async (input: Partial<Folder>) => {
  return await folderRepository.save(folderRepository.create(input));
};

export const getFolderById = async (folderId: string) => {
  return await folderRepository.findOneBy({ id: folderId });
};

export const getFolderByName = async (folderName: string) => {
    return await folderRepository.findOneBy({ name: folderName });
  };

export const getFolders = async () => {
    return await folderRepository.createQueryBuilder("folder")
    .getMany();
  };

export const getUserFolders = async (user: string) => {
    return await folderRepository.createQueryBuilder("folder")
    .where({userId: user})
    .getMany();
  };

// export const findPosts = async (req: Request) => {
//   const builder = folderRepository.createQueryBuilder('post');

//   if (req.query.search) {
//     builder.where('post.title LIKE :search OR post.content LIKE :search', {
//       search: `%${req.query.search}%`,
//     });
//   }

//   if (req.query.sort) {
//     const sortQuery = req.query.sort === '-price' ? 'DESC' : 'ASC';
//     builder.orderBy('post.title', sortQuery);
//   }

//   return await builder.getMany();
// };