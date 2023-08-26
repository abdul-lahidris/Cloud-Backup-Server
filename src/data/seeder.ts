import { faker } from '@faker-js/faker';
import { Console } from 'console';
import { UserFile } from '../entities/file.entity';
import { Folder } from '../entities/folder.entity';
import { User, RoleEnumType } from '../entities/user.entity';
// import { AppDataSource } from '../utils/data-source';
import { TestAppDataSource } from '../utils/test-data-source';

const fileRepository = TestAppDataSource.getRepository(UserFile);
const folderRepository = TestAppDataSource.getRepository(Folder);
const userRepository = TestAppDataSource.getRepository(User);

TestAppDataSource.initialize()
    .then(async () => {
        console.log('Connected to database...');
        try {
            for (let i = 0; i < 20; i++) {
                const user = await userRepository.save(userRepository.create({
                    name: faker.name.firstName(),
                    email: faker.name.lastName() + "@seed.com",
                    password: "Pass123.",
                    role: RoleEnumType.USER
                }));

                // create user folder
                const folderInput: Partial<Folder> = {
                    name: faker.lorem.words(1),
                    path: 'root',
                    userId: user!.id,
                };

                const rootFolder = await folderRepository.save(folderRepository.create(folderInput));
                const folderIds: string[] = [];
                for (let i = 0; i < 5; i++) {
                    const folderInput: Partial<Folder> = {
                        name: faker.lorem.words(1),
                        path: `root/${rootFolder}`,
                        userId: user!.id,
                    };

                    const f = await folderRepository.save(folderRepository.create(folderInput));
                    folderIds.push(f.id);
                }
                for (let i = 0; i < 20; i++) {
                    const fileInput: Partial<UserFile> = {
                        name: faker.lorem.words(1) + ".test",
                        folderId: folderIds[Math.floor(i / 5)],
                        userId: user!.id,
                        url: "https://idris-rise-bucket.s3.amazonaws.com/root/a6c552a2-3585-4e48-8d19-be519371021f/s.pdf"
                    };

                    await fileRepository.save(fileRepository.create(fileInput));

                }
            }
        console.log("-- DONE SEEDING...")
        } catch (error) {
            console.log(error);
            process.exit(1);
        }


    })
    .catch((error: any) => console.log(error));
