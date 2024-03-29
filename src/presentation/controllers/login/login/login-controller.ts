import { badRequest, ok, serverError, unauthorized } from "../../../helper/http/http-helper";
import { Authentication, HttpRequest, HttpResponse, Controller, Validation } from './login-controller-protocols';

export class LoginController implements Controller {
    constructor(
        private readonly authentication: Authentication, 
        private readonly validation: Validation) {}
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
       try {
            const error = this.validation.validate(httpRequest.body)
            if(error){
                return badRequest(error)
            }
            const { email, password } = httpRequest.body;
            const access_token = await this.authentication.auth({email, password});
            if(!access_token) {
                return unauthorized();
            }
            return ok({ access_token });
       } catch (error) {
            return serverError(error);
       }
    }

}