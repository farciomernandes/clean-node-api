import { HttpRequest, AddSurvey, AddSurveyModel, Validation } from "./add-survey-protocols";
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '../../../helper/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
    body: {
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }]
    }
})

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }

    return new ValidationStub();

}

const makeAddSurvey= (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
        async add(data: AddSurveyModel): Promise<void> {
            return Promise.resolve()
        }
    }

    return new AddSurveyStub();

}
interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
    addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const addSurveyStub = makeAddSurvey();
    const sut = new AddSurveyController(validationStub, addSurveyStub);

    return {
        sut,
        validationStub,
        addSurveyStub
    }
}

describe('AddSurvey Controller', ()=> {
    test('Should call Vaidation with correct values', async ()=> {
        const { sut, validationStub } = makeSut();
        const validateSpy = jest.spyOn(validationStub, "validate")
        const httpRequest = makeFakeRequest();
        await sut.handle(makeFakeRequest())
        expect(validateSpy).toHaveBeenLastCalledWith(httpRequest.body)
    })

    test('Should return 400 if Validation fails', async ()=> {
        const { sut, validationStub } = makeSut();
        jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error)
        const HttpResponse = await sut.handle(makeFakeRequest())
        expect(HttpResponse).toEqual(badRequest(new Error()))
    })

    test('Should call AddSurvey with correct values', async ()=> {
        const { sut, addSurveyStub } = makeSut();
        const addSpy = jest.spyOn(addSurveyStub, "add")
        const httpRequest = makeFakeRequest();
        await sut.handle(makeFakeRequest())
        expect(addSpy).toHaveBeenLastCalledWith(httpRequest.body)
    })

    test('Should return 500 if AddSurvey throws', async ()=> {
        const { sut, addSurveyStub } = makeSut();
        jest.spyOn(addSurveyStub, "add").mockReturnValueOnce(Promise.reject(new Error()))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 204 on success', async ()=> {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(noContent())
    })
    
})
