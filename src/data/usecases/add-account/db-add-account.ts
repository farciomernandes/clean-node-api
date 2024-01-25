import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from "./db-add-account-protocols";


export class DbAddAccount implements AddAccount {
    constructor(
        private readonly hasher: Hasher,
        private readonly addAccountRepositorie: AddAccountRepository,
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) { }

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
        if (!account) {
            const hashed_password = await this.hasher.hash(accountData.password);
            const new_account = await this.addAccountRepositorie.add(Object.assign({}, accountData, { password: hashed_password }))
            return new_account;
        }
        return null;
    }

}