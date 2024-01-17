import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { serverError } from "../../presentation/helper/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log"

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse = {
                body: {
                    email: 'any_email@mail.com',
                    name: 'any_name',
                    password: 'any_password',
                },
                statusCode: 200
            }
            return new Promise(resolve => resolve(httpResponse))
        }

    }
    return new ControllerStub();
}

const makeLogErrorRepository = (): LogErrorRepository =>{
    class LogErrorRepositoryStub implements LogErrorRepository {
        log(stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }

    }
    return new LogErrorRepositoryStub();
}
interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController();
    const logErrorRepositoryStub = makeLogErrorRepository();
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);

    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}

describe('LogController Decorator', ()=> {
    test('Should call controller handle', async ()=> {
        const { controllerStub, sut } = makeSut();
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('Should return the same result of the controllrer', async ()=> {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({
            body: {
                email: 'any_email@mail.com',
                name: 'any_name',
                password: 'any_password',
            },
            statusCode: 200
        })
    })

    test('Should call LogErrorRepository with correct error if controller retns a server error', async ()=> {
        const { controllerStub, sut, logErrorRepositoryStub } = makeSut();
        const error = serverError(new Error())
        error.body.stack = 'any_stack'
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve =>resolve(error)));
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})