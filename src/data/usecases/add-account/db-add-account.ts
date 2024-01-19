import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from "./db-add-account-protocols";


export class DbAddAccount implements AddAccount {
    private readonly hasher: Hasher;
    private readonly addAccountRepositorie: AddAccountRepository;

    constructor(hasher: Hasher, addAccountRepositorie: AddAccountRepository) {
        this.hasher = hasher;
        this.addAccountRepositorie = addAccountRepositorie;
    }
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashed_password = await this.hasher.hash(accountData.password);
        const account = await this.addAccountRepositorie.add(Object.assign({}, accountData, { password: hashed_password }))
        return account;
    }

}