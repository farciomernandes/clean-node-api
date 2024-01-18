import { LoadAccountByEmailRepository } from "../../../data/protocols/db/load-account-email-repository";
import { AccountModel } from "../../../domain/models/account";
import { AuthenticationModel } from "../authentication";
import { DbAuthentication } from "./db-authentication";

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByEmailRepositoryStub()

}

const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email@mail.com',
    password: 'any_password'
})

interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepository = makeLoadAccountByEmailRepository();
    const sut = new DbAuthentication(loadAccountByEmailRepository);

    return {
        loadAccountByEmailRepository,
        sut
    }

}

describe('DbAuthentication UseCase', ()=> {
    test('Should call LoadAccountByEmailRepository with correct email', async ()=> {
        const { sut, loadAccountByEmailRepository } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenLastCalledWith('any_email@mail.com')
    })

    test('Should throw if LoadAccountByEmailRepository throws', async ()=> {
        const { sut, loadAccountByEmailRepository } = makeSut()
        jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(new Promise((resolve, reject)=> reject(new Error())))
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })
})