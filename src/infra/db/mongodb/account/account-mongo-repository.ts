import { AccountModel } from "@/domain/models/account";
import { AddAccountModel } from "@/domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";
import { ObjectId } from "mongodb";
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from "@/data/usecases/authentication/db-authentication-protocol";
import { AddAccountRepository } from "@/data/usecases/add-account/db-add-account-protocols";


export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
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

    async updateAccessToken(id: string, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.updateOne(
                { 
                    _id: new ObjectId(id) 
                },{ 
                    $set: {
                    accessToken: token
                }
            }
        )
    }
}