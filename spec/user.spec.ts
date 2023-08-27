import supertest from 'supertest';
import { User, RoleEnumType } from "../src/entities/user.entity";
import { AppDataSource } from "../src/utils/data-source";

// import { OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';

import app from '../src/app';
import { RandomEmail } from 'src/utils/randomEmail';


const userRepository = AppDataSource.getRepository(User);
describe('Users Handlers', () => {
    const usersPath = '/api/auth';
    const registerUsersPath = `${usersPath}/register`;
    const loginUsersPath = `${usersPath}/login`;
    let token = '';
    const userIds: string[] = [];
    let agent: SuperTest<Test>;
    const testUsers : Partial<User>[]= [
        { name: 'Jack', email: RandomEmail(), password: "Pass123.", role:  RoleEnumType.ADMIN, verified: true},
        { name: 'Zuck', email: RandomEmail(), password: "Pass123.", role:  RoleEnumType.USER},
        { name: 'Elon', email: RandomEmail(), password: "Pass123.", role:  RoleEnumType.ADMIN, verified: true  },
    ]
    console.log(testUsers);
    async function createTestData() {
        const user1 = await userRepository.save(userRepository.create(testUsers[0]));
        const user2 = await userRepository.save(userRepository.create(testUsers[1]));
        console.log("--> user data created")//, [user1, user2]);
        userIds.push(user1.id);
        userIds.push(user2.id);

    }

    async function destroyTestData() {

        for (let i = 0; i < userIds.length; i++) {
            let user = await userRepository.findOneBy({ id: userIds[i] });
            if(user)
                await user?.remove();            
        }
        // let user = await userRepository.findOneBy({ email: testUsers[0].email });
        // if(user)
        //     await user?.remove();
        // user = await userRepository.findOneBy({ email: testUsers[1].email });
        // if(user)
        //     await user?.remove();
            
        console.log("--> user data destroyed");
    }

    beforeAll(async () => {
        agent = supertest.agent(app);
        await AppDataSource.initialize();
        // await destroyTestData();
        await createTestData();
    }, 50000);

    afterAll(async () => {
       await destroyTestData();
       await AppDataSource.destroy()
    });

    describe(`"POST:${registerUsersPath}"`, () => {
        it(`should return a JSON object with token and a status code of "${201}" if the
            request was successful.`, (done) => {
           
            agent.post(registerUsersPath).send({name: testUsers[2].name,email: testUsers[2].email, password: testUsers[2].password,  passwordConfirm: testUsers[2].password})
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(201);
                    expect(res.body.status).toBe('success');
                    // console.log(res.body);
                    // const retUsers = res.body.users;
                    // expect(retUsers).toEqual(testUsers);
                    // expect(res.body.error).toBeUndefined();
                    done();
                    userIds.push(res.body.user?.id)
                });
        });

        // it should return 400 on invalid pwd
        it(`should return a JSON object with token and a status code of "${400}" if the req was invalid.`, (done) => {
           
            agent.post(registerUsersPath).send({name: testUsers[2].name,email: testUsers[2].email, password: testUsers[2].password})
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(400);
                    expect(res.body.status).toBe('fail');
                    done();
                });
        });
    });

    describe(`"POST:${loginUsersPath}"`, () => {
        it(`should return a JSON object with token and a status code of "${200}" if the
            request was successful.`, (done) => {
           
            agent.post(loginUsersPath).send({email: testUsers[0].email, password: testUsers[0].password})
                .end((err: Error, res: Response) => {
                    // console.log(err);
                    expect(res.status).toBe(200);
                    expect(res.body.status).toBe('success');
                    done();
                    token = res.body.access_token!
                });
        });

        // it should return 401 for unverified account
        it(`should return a JSON object and a status code of "${401}" if the
            user account is unverified.`, (done) => {
           
            agent.post(loginUsersPath).send({email: testUsers[1].email, password: testUsers[1].password})
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(401);
                    expect(res.body.status).toBe('fail');
                    done();
                });
        });
        // it should return 400 on invalid pwd
        it(`should return a JSON object and a status code of "${400}" if the
            user account has invalid password.`, (done) => {
           
            agent.post(loginUsersPath).send({email: testUsers[0].email, password: 'invalid password'})
                .end((err: Error, res: Response) => {
                    expect(res.status).toBe(400);
                    expect(res.body.status).toBe('fail');
                    done();
                });
        });
    });
});
