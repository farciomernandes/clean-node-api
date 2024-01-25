import { DbAddSurvey } from './db-add-survey';
import { AddSurveyModel, AddSurveyRepository, SurveyAnswer } from './db-add-survey-protocols'

const makeFakeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
    }]
})

interface SutTypes {
    sut: DbAddSurvey
    addSurveyRepository: AddSurveyRepository
}

const makeSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
        async add(surveyData: AddSurveyModel): Promise<void> {
            return Promise.resolve()
        }
    }
    return new AddSurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
    const addSurveyRepository = makeSurveyRepository()
    const sut = new DbAddSurvey(addSurveyRepository);

    return {
        sut,
        addSurveyRepository
    }
}

describe('DbAddSurvey Usecase', () => {
    test('Should call AddSurveyRepository if correct values', () => {
        const { sut, addSurveyRepository } = makeSut()
        const addSpy = jest.spyOn(addSurveyRepository, "add")
        const surveyData = makeFakeSurveyData();
        sut.add(surveyData)
        expect(addSpy).toHaveBeenCalledWith(surveyData)
    })

    test('Should throw if AddSurveyRepository throws', async () => {
        const { sut, addSurveyRepository } = makeSut();
        jest.spyOn(addSurveyRepository, 'add').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.add(makeFakeSurveyData());
        await expect(promise).rejects.toThrow();
    })
})