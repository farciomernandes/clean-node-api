import { EmailInUseError } from "../../../../presentation/errors";
import { badRequest, serverError, ok, forbbiden } from "../../../helper/http/http-helper";
import { HttpRequest, HttpResponse, Controller, AddAccount, Validation, Authentication } from "./signup-controller-protocols"

export class SignUpController implements Controller {
    constructor(
        private readonly addAccount: AddAccount, 
        private readonly validation: Validation,
        private readonly authentication: Authentication
        ) {}
    async handle(httpRequest: HttpRequest): Promise <HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if(error) {
                return badRequest(error)
            }
            const { email, password, name } = httpRequest.body;
            const account = await this.addAccount.add({
                name,
                email,
                password
            })

            if(!account){
                return forbbiden(new EmailInUseError())
            }

            const access_token = await this.authentication.auth({email, password});

            return ok({ access_token })
        } catch (error) {
            return serverError(error);
        }
    }
}