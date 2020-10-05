import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate', async () => {
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        const response = await authenticateUser.execute({
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
    });
    it('should not be able to authenticate with non existing user', async () => {
        expect(
            authenticateUser.execute({
                email: 'johndoe@gmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to authenticate user with wrong password', async () => {
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456',
        });

        expect(
            authenticateUser.execute({
                email: 'johndoe@gmail.com',
                password: 'wrongpassword',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
