import { Controller } from '../../protocols/controller'
import { MissingParamError } from "../../../presentation/errors";
import { badRequest } from "../../../presentation/helper/http-helper";
import { HttpRequest, HttpResponse } from '../signup/signup-protocols';

export class LoginController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }

}