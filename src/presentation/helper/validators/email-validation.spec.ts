import { InvalidParamError } from "../../errors";
import { EmailValidator } from "@/presentation/protocols/email-validator";
import { EmailValidation } from "./email-validation";
  
const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
}

interface SutTypes {
    sut: EmailValidation
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const sut = new EmailValidation('email', emailValidatorStub);
    return {
        sut,
        emailValidatorStub,
    }
}

const makeEmailValidatorWithError = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            throw new Error();
        }
    }
    return new EmailValidatorStub();

}


describe('Email Validation', () => {

    test('Should return an error if EmailValidator returns false', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = sut.validate({ email: 'any_email@mail.com' });

        expect(httpResponse).toEqual(new InvalidParamError('email'));
    })

    test('Should call EmailValidat with correct email', () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        sut.validate({ email: 'any_email@mail.com' });

        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');

    })

    test('Should throw if EmailValidator throws', async () => {
        const emailValidatorStub = makeEmailValidatorWithError();
        const { sut } = makeSut();
        sut.validate({ email: 'any_email@mail.com' });

        expect(sut.validate).toThrow();

    })

})