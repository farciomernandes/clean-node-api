import { AccountModel } from "../../domain/models/account";
import { AddAccountModel } from '../../domain/usecases/add-account'

export interface AddAccountRepositorie {
    add (accountData: AddAccountModel): Promise <AccountModel>;
}