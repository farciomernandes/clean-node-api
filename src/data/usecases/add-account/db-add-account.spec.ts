import { DbAddAccount } from "./db-add-account";
import { AccountModel, Encrypter, AddAccountRepositorie } from "./db-add-account-protocols";


const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(vakue: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub();

}


const makeAddAccountRepositorie = (): AddAccountRepositorie => {
    class AddAccountRepositorieStub implements AddAccountRepositorie {
        async add(accountData: AccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'hashed_password',
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }

    return new AddAccountRepositorieStub();

}
interface SutTypes {
    sut: DbAddAccount;
    encrypterStub: Encrypter;
    addAccountRepositorieStub: AddAccountRepositorie;
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter();
    const addAccountRepositorieStub = makeAddAccountRepositorie();

    const sut = new DbAddAccount(encrypterStub, addAccountRepositorieStub);

    return {
        sut,
        encrypterStub,
        addAccountRepositorieStub
    }
}


describe('DbAddAccount Usecase', () => {
    test('Should call  Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut();

        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        await sut.add(accountData);

        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut();

        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolver, reject) => reject(new Error())))
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        const promise = sut.add(accountData);

        await expect(promise).rejects.toThrow();
    })

    test('Should call AddAccountRepositorie with correct values', async () => {
        const { sut, addAccountRepositorieStub } = makeSut();

        const addSpy = jest.spyOn(addAccountRepositorieStub, 'add')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        await sut.add(accountData);

        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'hashed_password'

        })
    })

    test('Should throw if Encrypter throws', async () => {
        const { sut, addAccountRepositorieStub } = makeSut();

        jest.spyOn(addAccountRepositorieStub, 'add').mockReturnValueOnce(new Promise((resolver, reject) => reject(new Error())))
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        const promise = sut.add(accountData);

        await expect(promise).rejects.toThrow();
    })

    test('Should return an account on success', async () => {
        const { sut } = makeSut();

        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        const account = await sut.add(accountData);

        expect(account).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'hashed_password'
        })
    })
})