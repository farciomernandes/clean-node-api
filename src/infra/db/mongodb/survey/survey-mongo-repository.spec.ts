import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './surver-mongo-repository';
import env from '../../../../main/config/env';

let surveyCollection: Collection;
describe('Survey Mongo Repository', () => {

    beforeAll(async () => {
        await MongoHelper.connect(env.mongoUrl);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async ()=> {
       surveyCollection = await MongoHelper.getCollection('surveys');
       await surveyCollection.deleteMany({});
    })


    const makeSut = (): SurveyMongoRepository => {
        return new SurveyMongoRepository();
    }

    test('Should return an account on add success', async () => {
        const sut = makeSut();
        await sut.add({
            question: 'any_question',
            answers: [{
                image: 'any_image',
                answer: 'any_answer'
            }, {
                answer: 'other_answer'
            }]
        });

        const survey = surveyCollection.findOne({
            question: 'any_question'
        })

        expect(survey).toBeTruthy();
    })
})
