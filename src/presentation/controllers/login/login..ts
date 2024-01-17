import { InvalidParamError, MissingParamError } from "../../../presentation/errors";
import { badRequest, ok, serverError, unauthorized } from "../../../presentation/helper/http-helper";
import { Authentication, EmailValidator, HttpRequest, HttpResponse, Controller } from './login-protocols';

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication


    constructor(emailValidator: EmailValidator, authentication: Authentication) {
        this.emailValidator = emailValidator;
        this.authentication = authentication
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
       try {
            const requiredFields = ['email', 'password'];
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field));

                }
            }
            const { email, password } = httpRequest.body;
            const isValid = this.emailValidator.isValid(email);
            if(!isValid){
                return badRequest(new InvalidParamError('email'))
            }
            const access_token = await this.authentication.auth(email, password);
            if(!access_token) {
                return unauthorized();
            }
            return ok({ access_token });
       } catch (error) {
            return serverError(error);
       }
    }

}