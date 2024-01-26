import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';
import env from '../../config/env';
import { makeLoginValidation } from '../controllers/login/login-validation-factory';
import { LoginController } from '../../../presentation/controllers/login/login/login-controller';



export const makeLoginController = (): Controller => {
    const salt = 12;
    const accountMongoRepository = new AccountMongoRepository();
    const bcryptAdapter = new BcryptAdapter(salt);
    const jwtAdapter = new JwtAdapter(env.jwt_secret)
    const logMongoRepository = new LogMongoRepository();
    const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository);
    const loginController = new LoginController(dbAuthentication, makeLoginValidation());
    return new LogControllerDecorator(loginController, logMongoRepository);
}