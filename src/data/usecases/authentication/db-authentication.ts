import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-email-repository";
import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../../data/protocols/criptography/hash-compare";
import { TokenGenerator } from "@/data/protocols/criptography/token-generator";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/update-access-token-repository";


export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer;
    private readonly tokenGenerator: TokenGenerator
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    constructor(
        loadAccountByEmailRepository: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        tokenGenerator: TokenGenerator,
        updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository;
        this.hashComparer = hashComparer;
        this.tokenGenerator = tokenGenerator;
        this.updateAccessTokenRepository = updateAccessTokenRepository;
    }

    async auth(authentication: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email)
        if (account) {
            const isValid = await this.hashComparer.compare(authentication.password, account.password);
            if (isValid) {
                const access_token = await this.tokenGenerator.generate(account.id)
                await this.updateAccessTokenRepository.update(account.id, access_token)
                return access_token;
            }
        }
        return null;
    }

}