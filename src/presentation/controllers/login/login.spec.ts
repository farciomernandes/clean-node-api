import { InvalidParamError, MissingParamError } from "../../../presentation/errors";
import { badRequest } from "../../../presentation/helper/http-helper";
import { EmailValidator } from "../signup/signup-protocols";
import { LoginController } from "./login.";



const makeEmailValidator = (): EmailValidator => {
    class EmailVaidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailVaidatorStub();
}

const makeFakeRequest = () => ({
    body: {
        email: 'any_email@mail.com',
        password: 'any_password'
    }
})
interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const sut = new LoginController(emailValidatorStub);
    return {
        sut,
        emailValidatorStub
    }
}


describe('Login Controller', () => {
    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email@mail.com'
            }
        }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    test('Should return 400 if no an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('Should call EmailVaidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        await sut.handle( makeFakeRequest())

        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})