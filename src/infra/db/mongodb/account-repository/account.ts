import { AccountModel } from "@/domain/models/account";
import { AddAccountModel } from "@/domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";
import { AddAccountRepository } from "@/data/protocols/db/add-account-repository";
import { LoadAccountByEmailRepository } from "@/data/protocols/db/load-account-email-repository";


export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const result = await (await accountCollection).insertOne(accountData);
        const account = await MongoHelper.findOne('accounts', result.insertedId);
        return MongoHelper.map(account)
    }

    async loadByEmail(email: string): Promise<AccountModel | null> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const account = await accountCollection.findOne<AccountModel>({ email });
        return account && MongoHelper.map(account)
    }
}