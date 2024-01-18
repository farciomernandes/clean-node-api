import { LoadAccountByEmailRepository } from "../../../data/protocols/load-account-email-repository";
import { AccountModel } from "../../../domain/models/account";
import { DbAuthentication } from "./db-authentication";


describe('DbAuthentication UseCase', ()=> {
    test('Should call LoadAccountByEmailRepository with correct email', async ()=> {
        class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
            async load(email: string): Promise<AccountModel> {
                const account = {
                    id: 'any_id',
                    name: 'any_name',
                    email: 'any_email@mail.com',
                    password: 'any_password'
                }
                return new Promise(resolve => resolve(account))
            }
        }
        const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
        const sut = new DbAuthentication(loadAccountByEmailRepository);
        const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
        await sut.auth({
            email: 'any_email@mail.com',
            password: 'any_password'
        })
        expect(loadSpy).toHaveBeenLastCalledWith('any_email@mail.com')
    })
})