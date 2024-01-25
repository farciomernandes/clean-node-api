import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from "./db-add-account-protocols";


export class DbAddAccount implements AddAccount {
    constructor(
        private readonly hasher: Hasher, 
        private readonly addAccountRepositorie: AddAccountRepository,
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
        ) {}
        
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
        const hashed_password = await this.hasher.hash(accountData.password);
        const account = await this.addAccountRepositorie.add(Object.assign({}, accountData, { password: hashed_password }))
        return account;
    }

}