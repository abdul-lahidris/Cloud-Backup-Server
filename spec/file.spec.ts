import supertest from 'supertest';
import { User, RoleEnumType } from "../src/entities/user.entity";
import { AppDataSource } from "../src/utils/data-source";
import redisClient from 'src/utils/connectRedis';
// import { OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';

import app from '../src/app';
import { signTokens } from 'src/services/user.service';
import { UserFile } from 'src/entities/file.entity';
import { Folder } from 'src/entities/folder.entity';
import { RandomEmail } from 'src/utils/randomEmail';


const userRepository = AppDataSource.getRepository(User);
const fileRepository = AppDataSource.getRepository(UserFile);
const folderRepository = AppDataSource.getRepository(Folder);
describe('Files Routes', () => {
    const filesPath = '/api/files';
    const createFilePath = `${filesPath}/create`;
    const updateFilePath = `${filesPath}/update`;
    let admin_token = '';
    let user_token = '';
    const userIds: string[] = [];
    const fileIds: string[] = [];
    const folderIds: string[] = [];
    let agent: SuperTest<Test>;
    const testUsers : Partial<User>[]= [
        { name: 'Jack', email: RandomEmail(), password: "Pass123.", role:  RoleEnumType.ADMIN, verified: true},
        { name: 'Zuck', email: RandomEmail(), password: "Pass123.", role:  RoleEnumType.USER, verified: true }
    ]

    
    async function createTestData() {
        try {
            const user1 = await userRepository.save(userRepository.create(testUsers[0]));
            const user2 = await userRepository.save(userRepository.create(testUsers[1]));
            console.log("--> user data created");//, [user1, user2]);
            const folder1 = await folderRepository.save(folderRepository.create({
                name: 'TZ Folder',
                path: `root/${user2.id}`,
                userId: user2.id
            }));
            const file1 = await fileRepository.save(fileRepository.create({
                name: 'TZ-File.mp4',
                url: `https://idris-rise-bucket.s3.amazonaws.com/vlc-record-2022-05-23-22h42m13s-The.Big.Bang.Theory.S09E09.720p.HDTV.H265-MRSK.mkv-.mp4`,
                userId: user2.id,
                folderId: folder1.id
            }));
            console.log("--> user file created");
            userIds.push(user1.id);
            userIds.push(user2.id);
            fileIds.push(file1.id);
            folderIds.push(folder1.id);
            admin_token = (await signTokens(user1)).access_token;
            user_token = (await signTokens(user2)).access_token;
        } catch (error) {
            destroyTestData();
            console.log(error);
        }
        
    }

    async function destroyTestData() {

        for (let i = 0; i < userIds.length; i++) {
            let user = await userRepository.findOneBy({ id: userIds[i] });
            if(user)
                await user?.remove();            
        }  
        for (let i = 0; i < fileIds.length; i++) {
            let fold = await fileRepository.findOneBy({ id: fileIds[i] });
            if(fold)
                await fold?.remove();            
        }  
        for (let i = 0; i < folderIds.length; i++) {
            let fold = await folderRepository.findOneBy({ id: fileIds[i] });
            if(fold)
                await fold?.remove();            
        }            
        console.log("--> File, folder and User data destroyed");
    }

    beforeAll(async () => {
        agent = supertest.agent(app);
        await AppDataSource.initialize();
        // await destroyTestData();
        await createTestData();
    }, 50000);

    afterAll(async () => {
       await destroyTestData();
       await AppDataSource.destroy();
    });

    describe(`"POST:${createFilePath}"`, () => {
        it(`should create a File and a status code of "${201}" if the
            request was successful.`, (done) => {
        //    const nf: File = new File([],'temp-File.mp4'); //new empty file
            agent.post(createFilePath)
            .field('folderId', folderIds[0])
            .field('userId', userIds[1])
            .attach('file', 'public/qr-code-working.jpg')
            .set("Authorization", `Bearer ${user_token}`)
            .set("Content-Type", "multipart/form-data")
                .end((err: Error, res: Response) => {
                    // console.log(res.body);
                    // console.log(err);
                    expect(res.status).toBe(201);
                    expect(res.body.status).toBe('success');
                    done();
                    fileIds.push(res.body.file?.id)
                });
        });

        // it should return 400 on invalid pwd
        it(`should NOT create a File and return status code of "${400}" if the
            request was unsuccessful.`, (done) => {
        //    const nf: File = new File([],'temp-File.mp4'); //new empty file
            agent.post(createFilePath)
            .field('folderId', folderIds[0])
            .field('userId', "")
            .attach('file', 'public/qr-code-working.jpg')
            .set("Authorization", `Bearer ${user_token}`)
            .set("Content-Type", "multipart/form-data")
                .end((err: Error, res: Response) => {
                    // console.log(res.body);
                    // console.log(err);
                    expect(res.status).toBe(400);
                    expect(res.body.status).toBe('fail');
                    done();
                });
        });
    });

    describe(`"GET:${filesPath}"`, () => {
        it(`should return all FILES and a status code of "${200}" if the
            request was made by an ADMIN.`, (done) => {
           
            agent.get(filesPath).set("Authorization", `Bearer ${admin_token}`)
                .end((err: Error, res: Response) => {
                    // console.log(res.body);
                    expect(res.status).toBe(200);
                    expect(res.body.status).toBe('success');
                    done();
                    // userIds.push(res.body.user?.id)
                });
        });
        
        it(`should return a status code of "${401}" if the
            request was NOT made by an ADMIN.`, (done) => {
           
            agent.get(filesPath).set("Authorization", `Bearer ${user_token}`)
                .end((err: Error, res: Response) => {
                    // console.log(res.body);
                    expect(res.status).toBe(401);
                    expect(res.body.status).toBe('fail');
                    done();
                    // userIds.push(res.body.user?.id)
                });
        });
    });

    describe(`"GET:${filesPath}/:id"`, () => {
        it(`should return a File and a status code of "${200}" if the
            file exists.`, (done) => {
           
            agent.get(`${filesPath}/${fileIds[0]}`).set("Authorization", `Bearer ${admin_token}`)
                .end((err: Error, res: Response) => {
                    // console.log(fileIds);
                    // console.log(res.body);
                    expect(res.status).toBe(200);
                    expect(res.body.status).toBe('success');
                    done();
                    // userIds.push(res.body.user?.id)
                });
        });
        
        it(`should return a status code of "${401}" if the
            request was NOT authorised.`, (done) => {
           
            agent.get(`${filesPath}/${fileIds[0]}`).set("Authorization", `Bearer invalid_token`)
                .end((err: Error, res: Response) => {
                    // console.log(res.body);
                    expect(res.status).toBe(401);
                    expect(res.body.status).toBe('fail');
                    done();
                    // userIds.push(res.body.user?.id)
                });
        });
        it(`should return a status code of "${404}" if the
            file was NOT FOUND.`, (done) => {
           
            agent.get(`${filesPath}/a6c552a2-3585-4e48-8d19-be519371021f`).set("Authorization", `Bearer ${user_token}`)
                .end((err: Error, res: Response) => {
                    // console.log(res.body);
                    expect(res.status).toBe(404);
                    expect(res.body.status).toBe('fail');
                    done();
                    // userIds.push(res.body.user?.id)
                });
        });
    });

    describe(`"GET:${filesPath}/user/:userId"`, () => {
        it(`should return an array of user's files and a status code of "${200}" if the
            user exists.`, (done) => {
           
            agent.get(`${filesPath}/user/${userIds[1]}`).set("Authorization", `Bearer ${user_token}`)
                .end((err: Error, res: Response) => {
                    // console.log(fileIds);
                    // console.log(res.body);
                    expect(res.status).toBe(200);
                    expect(res.body.status).toBe('success');
                    done();
                    // userIds.push(res.body.user?.id)
                });
        });
        
        it(`should return a status code of "${401}" if the
            request was NOT authorised.`, (done) => {
           
            agent.get(`${filesPath}/user/${userIds[1]}`).set("Authorization", `Bearer invalid_token`)
                .end((err: Error, res: Response) => {
                    // console.log(res.body);
                    expect(res.status).toBe(401);
                    expect(res.body.status).toBe('fail');
                    done();
                    // userIds.push(res.body.user?.id)
                });
        });
        it(`should return a status code of "${404}" if the
            FOLDER was NOT FOUND.`, (done) => {
           
            agent.get(`${filesPath}/a6cd52a2-3585-4e48-8d19-be519371021f`).set("Authorization", `Bearer ${user_token}`)
                .end((err: Error, res: Response) => {
                    // console.log(res.body);
                    expect(res.status).toBe(404);
                    expect(res.body.status).toBe('fail');
                    done();
                    // userIds.push(res.body.user?.id)
                });
        });
    });
});
