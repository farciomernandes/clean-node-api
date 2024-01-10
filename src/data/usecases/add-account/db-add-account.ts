import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from "./db-add-account-protocols";


export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter;
    private readonly addAccountRepositorie: AddAccountRepository;

    constructor(encrypter: Encrypter, addAccountRepositorie: AddAccountRepository) {
        this.encrypter = encrypter;
        this.addAccountRepositorie = addAccountRepositorie;
    }
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashed_password = await this.encrypter.encrypt(accountData.password);
        const account = await this.addAccountRepositorie.add(Object.assign({}, accountData, { password: hashed_password }))
        return account;
    }

}