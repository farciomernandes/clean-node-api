import { Validation } from "../../../presentation/protocols/validation"
import { makeSignUpValidation } from "./signup-validation-factory"
import { EmailValidator } from "../../../presentation/protocols/email-validator"
import { RequiredFieldValidation, EmailValidation, ValidationComposite, CompareFieldsValidation } from '../../../presentation/helper/validators';

jest.mock("../../../presentation/helper/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
}

describe('SignUpValidationFacotry', ()=> {
    test('Should call ValidationComposite with all validations', ()=> {
        makeSignUpValidation()
        const validations: Validation[] = []
        for(const field of ['name', 'email', 'password', 'passwordConfirmation']){
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})