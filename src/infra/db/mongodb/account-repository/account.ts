import { AddAccountRepositorie } from "@/data/protocols/add-account-repositorie";
import { AccountModel } from "@/domain/models/account";
import { AddAccountModel } from "@/domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";


export class AccountMongoRepository implements AddAccountRepositorie {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);
        const account = await MongoHelper.findOne('accounts', result.insertedId);
        const { _id, ...accountWithoutId } = account;
        return Object.assign({}, accountWithoutId, { id: _id });
    }

}