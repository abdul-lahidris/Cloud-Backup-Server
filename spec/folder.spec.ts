import supertest from 'supertest';
import { User, RoleEnumType } from "../src/entities/user.entity";
import { AppDataSource } from "../src/utils/data-source";

// import { OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';

import app from '../src/app';
import { signTokens } from 'src/services/user.service';
import { Folder } from 'src/entities/folder.entity';


const userRepository = AppDataSource.getRepository(User);
const folderRepository = AppDataSource.getRepository(Folder);
describe('Users Routes', () => {
    const foldersPath = '/api/folders';
    const createFolderPath = `${foldersPath}/create`;
    const updateFolderPath = `${foldersPath}/update`;
    let admin_token = '';
    let user_token = '';
    const userIds: string[] = [];
    const folderIds: string[] = [];
    let agent: SuperTest<Test>;
    const testUsers : Partial<User>[]= [
        { name: 'Jack', email: 'ripper@t.co', password: "Pass123.", role:  RoleEnumType.ADMIN, verified: true},
        { name: 'Zuck', email: 'ts-zyck@trise.co', password: "Pass123.", role:  RoleEnumType.USER, verified: true }
    ]

    
    async function createTestData() {
        const user1 = await userRepository.save(userRepository.create(testUsers[0]));
        const user2 = await userRepository.save(userRepository.create(testUsers[1]));
        console.log("--> user data created", [user1, user2]);
        userIds.push(user1.id);
        userIds.push(user2.id);
        admin_token = (await signTokens(user1)).access_token;
        user_token = (await signTokens(user2)).access_token;
    }

    async function destroyTestData() {

        for (let i = 0; i < userIds.length; i++) {
            let user = await userRepository.findOneBy({ id: userIds[i] });
            if(user)
                await user?.remove();            
        }  
        for (let i = 0; i < folderIds.length; i++) {
            let fold = await folderRepository.findOneBy({ id: folderIds[i] });
            if(fold)
                await fold?.remove();            
        }            
        console.log("--> Folder data destroyed");
    }

    beforeAll(async () => {
        agent = supertest.agent(app);
        await AppDataSource.initialize();
        // await destroyTestData();
        await createTestData();
    });

    afterAll(async () => {
       await destroyTestData();
    });

    describe(`"POST:${createFolderPath}"`, () => {
        it(`should create a FOLDER and a status code of "${201}" if the
            request was successful.`, (done) => {
           
            agent.post(createFolderPath).send({name: 'Folder t1', userId: userIds[1]})
            .set("Authorization", `Bearer ${user_token}`)
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(201);
                    expect(res.body.status).toBe('success');
                    done();
                    userIds.push(res.body.user?.id)
                });
        });

        // it should return 400 on invalid pwd
        it(`should return a JSON object with token and a status code of "${401}" if the user is unauthorized.`, (done) => {
           
            agent.post(createFolderPath).send({name: 'Folder t1', userId: userIds[1]})
            .set("Authorization", `Bearer invalid_token}`)
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(201);
                    expect(res.body.status).toBe('success');
                    done();
                    userIds.push(res.body.user?.id)
                });
        });
    });

    // describe(`"POST:${loginUsersPath}"`, () => {
    //     it(`should return a JSON object with token and a status code of "${200}" if the
    //         request was successful.`, (done) => {
           
    //         agent.post(loginUsersPath).send({email: testUsers[0].email, password: testUsers[0].password})
    //             .end((err: Error, res: Response) => {
    //                 expect(res.status).toBe(200);
    //                 expect(res.body.status).toBe('success');
    //                 done();
    //                 token = res.body.access_token!
    //             });
    //     });

    //     // it should return 401 for unverified account
    //     it(`should return a JSON object and a status code of "${401}" if the
    //         user account is unverified.`, (done) => {
           
    //         agent.post(loginUsersPath).send({email: testUsers[1].email, password: testUsers[1].password})
    //             .end((err: Error, res: Response) => {
    //                 expect(res.status).toBe(401);
    //                 expect(res.body.status).toBe('fail');
    //                 done();
    //             });
    //     });
    //     // it should return 400 on invalid pwd
    //     it(`should return a JSON object and a status code of "${400}" if the
    //         user account has invalid password.`, (done) => {
           
    //         agent.post(loginUsersPath).send({email: testUsers[0].email, password: 'invalid password'})
    //             .end((err: Error, res: Response) => {
    //                 expect(res.status).toBe(400);
    //                 expect(res.body.status).toBe('fail');
    //                 done();
    //             });
    //     });
    // });
});
