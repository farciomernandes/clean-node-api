import { AccountModel } from "@/domain/models/account";
import { AddAccountModel } from "@/domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";
import { AddAccountRepository } from "@/data/protocols/add-account-repository";


export class AccountMongoRepository implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);
        const account = await MongoHelper.findOne('accounts', result.insertedId);
        return MongoHelper.map(account)
    }

}