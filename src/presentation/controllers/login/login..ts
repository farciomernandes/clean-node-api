import { Controller } from '../../protocols/controller'
import { InvalidParamError, MissingParamError } from "../../../presentation/errors";
import { badRequest } from "../../../presentation/helper/http-helper";
import { EmailValidator, HttpRequest, HttpResponse } from '../signup/signup-protocols';

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        if(!httpRequest.body.email){
            return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
        }
        if(!httpRequest.body.password){
            return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
        }
        const isValid = this.emailValidator.isValid(httpRequest.body.email);
        if(!isValid){
            return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
        }
    }

}