import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-email-repository";
import { AccountModel } from "../../../domain/models/account";
import { AuthenticationModel } from "../../../domain/usecases/authentication";
import { DbAuthentication } from "./db-authentication";
import { HashComparer } from "../../../data/protocols/criptography/hash-compare";
import { TokenGenerator } from "../../../data/protocols/criptography/token-generator";

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByEmailRepositoryStub()

}


const makeHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare(value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }
    return new HashComparerStub()

}

const makeTokenGenerator = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
        async generate(id: string): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new TokenGeneratorStub()

}

const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email@mail.com',
    password: 'any_password'
})

interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepository: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    tokenGeneratorStub: TokenGenerator
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepository = makeLoadAccountByEmailRepository();
    const hashComparerStub = makeHashComparer();
    const tokenGeneratorStub = makeTokenGenerator();
    const sut = new DbAuthentication(
        loadAccountByEmailRepository,
        hashComparerStub,
        tokenGeneratorStub
    );

    return {
        sut,
        loadAccountByEmailRepository,
        hashComparerStub,
        tokenGeneratorStub
    }

}

describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenLastCalledWith('any_email@mail.com')
    })

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()
        jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })

    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()
        jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(null)
        const access_token = await sut.auth(makeFakeAuthentication())
        expect(access_token).toBe(null)
    })

    test('Should call HashComparer with correct values', async () => {
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(makeFakeAuthentication())
        expect(compareSpy).toHaveBeenLastCalledWith('any_password', 'hashed_password')
    })

    test('Should throw if HashComparer throws', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuthentication())
        expect(promise).rejects.toThrow()
    })

    test('Should return null if HashCompare returns false', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        const access_token = await sut.auth(makeFakeAuthentication())
        expect(access_token).toBe(null)
    })

    test('Should call TokenGenerator with correct id', async () => {
        const { sut, tokenGeneratorStub } = makeSut()
        const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
        await sut.auth(makeFakeAuthentication())
        expect(generateSpy).toHaveBeenLastCalledWith('any_id')
    })

    test('Should throw if TokenGenerator throws', async () => {
        const { sut, tokenGeneratorStub } = makeSut()
        jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.auth(makeFakeAuthentication())
        expect(promise).rejects.toThrow()
    })

    test('Should call TokenGenerator with correct id', async () => {
        const { sut } = makeSut()
        const access_token = await sut.auth(makeFakeAuthentication())
        expect(access_token).toBe('any_token')
    })
})