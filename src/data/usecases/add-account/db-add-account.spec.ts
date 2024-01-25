import { DbAddAccount } from "./db-add-account";
import { AddAccountRepository, Hasher, AccountModel, AddAccountModel, LoadAccountByEmailRepository } from "./db-add-account-protocols";


const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hash(vakue: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new HasherStub();
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountRepositoryStub();
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByEmailRepositoryStub()

}

interface SutTypes {
    sut: DbAddAccount;
    hasherStub: Hasher;
    addAccountRepositoryStub: AddAccountRepository;
    loadAccountByEmailRepository: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
    const hasherStub = makeHasher();
    const addAccountRepositoryStub = makeAddAccountRepository();
    const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()

    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepository);

    return {
        sut,
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepository
    }
}


describe('DbAddAccount Usecase', () => {
    test('Should call  Hasher with correct password', async () => {
        const { sut, hasherStub } = makeSut();

        const encryptSpy = jest.spyOn(hasherStub, 'hash')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        await sut.add(accountData);

        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Should throw if Hasher throws', async () => {
        const { sut, hasherStub } = makeSut();
        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolver, reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccountData());

        await expect(promise).rejects.toThrow();
    })

    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData());

        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'hashed_password'

        })
    })

    test('Should throw if Hasher throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolver, reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccountData());

        await expect(promise).rejects.toThrow();
    })

    test('Should return an account on success', async () => {
        const { sut } = makeSut();
        const account = await sut.add(makeFakeAccountData());

        expect(account).toEqual(makeFakeAccount())
    })
    
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepository } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')
        await sut.add(makeFakeAccountData());
        expect(loadSpy).toHaveBeenLastCalledWith('valid_email@mail.com')
    })
})