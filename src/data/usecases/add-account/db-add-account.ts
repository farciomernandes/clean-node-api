import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepositorie } from "./db-add-account-protocols";


export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter;
    private readonly addAccountRepositorie: AddAccountRepositorie;

    constructor(encrypter: Encrypter, addAccountRepositorie: AddAccountRepositorie) {
        this.encrypter = encrypter;
        this.addAccountRepositorie = addAccountRepositorie;
    }
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashed_password = await this.encrypter.encrypt(accountData.password);

        await this.addAccountRepositorie.add(Object.assign({}, accountData, { password: hashed_password }))
        return new Promise(resolve => resolve(null))
    }

}