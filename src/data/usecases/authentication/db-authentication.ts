import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-email-repository";
import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../../data/protocols/criptography/hash-compare";
import { TokenGenerator } from "@/data/protocols/criptography/token-generator";


export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer;
    private readonly tokenGenerator: TokenGenerator

    constructor(
        loadAccountByEmailRepository: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        tokenGenerator: TokenGenerator
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository;
        this.hashComparer = hashComparer;
        this.tokenGenerator = tokenGenerator
    }

    async auth(authentication: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email)
        if (account) {
            const isValid = await this.hashComparer.compare(authentication.password, account.password);
            if (isValid) {
                const access_token = await this.tokenGenerator.generate(account.id)
                return access_token;
            }
        }
        return null;
    }

}