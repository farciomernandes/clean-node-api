import { 
    LoadAccountByEmailRepository, 
    Authentication, 
    AuthenticationModel, 
    HashComparer, 
    Encrypter, 
    UpdateAccessTokenRepository 
} from "./db-authentication-protocol";
export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer;
    private readonly encrypter: Encrypter
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    constructor(
        loadAccountByEmailRepository: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        Encrypter: Encrypter,
        updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository;
        this.hashComparer = hashComparer;
        this.encrypter = Encrypter;
        this.updateAccessTokenRepository = updateAccessTokenRepository;
    }

    async auth(authentication: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email)
        if (account) {
            const isValid = await this.hashComparer.compare(authentication.password, account.password);
            if (isValid) {
                const access_token = await this.encrypter.encrypt(account.id)
                await this.updateAccessTokenRepository.updateAccessToken(account.id, access_token)
                return access_token;
            }
        }
        return null;
    }

}