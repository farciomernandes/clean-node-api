import { LoadAccountByEmailRepository } from "@/data/protocols/load-account-email-repository";
import { Authentication, AuthenticationModel } from "../authentication";


export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

    constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository){
        this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    }

    async auth(authentication: AuthenticationModel): Promise<string> {
        await this.loadAccountByEmailRepository.load(authentication.email)
        return null;
    }

}