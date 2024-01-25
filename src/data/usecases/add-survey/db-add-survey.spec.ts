import { DbAddSurvey } from './db-add-survey';
import { AddSurveyModel, AddSurveyRepository, SurveyAnswer } from './db-add-survey-protocols'

const makeFakeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
    }]
})

describe('DbAddSurvey Usecase', ()=> {
    test('Should call AddSurveyRepository if correct values', ()=> {
        class AddSurveyRepositoryStub implements AddSurveyRepository {
            async add(surveyData: AddSurveyModel): Promise<void>{
                return Promise.resolve()
            }
        }
        const addSurveyRepository = new AddSurveyRepositoryStub()
        const addSpy = jest.spyOn(addSurveyRepository, "add")
        const sut = new DbAddSurvey(addSurveyRepository);
        const surveyData = makeFakeSurveyData();
        sut.add(surveyData)
        expect(addSpy).toHaveBeenCalledWith(surveyData)
    })
})